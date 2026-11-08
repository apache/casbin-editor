#!/usr/bin/env python3
# Licensed to the Apache Software Foundation (ASF) under one
# or more contributor license agreements. See the NOTICE file
# distributed with this work for additional information
# regarding copyright ownership. The ASF licenses this file
# to you under the Apache License, Version 2.0 (the
# "License"); you may not use this file except in compliance
# with the License. You may obtain a copy of the License at
#
# http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing,
# software distributed under the License is distributed on an
# "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
# KIND, either express or implied. See the License for the
# specific language governing permissions and limitations
# under the License.

"""Make an unsigned candidate from committed bytes, or verify those bytes.

Signing, ASF staging, voting and promotion are separate release-manager steps.
The final release must reuse the approved archive rather than rebuild it.
"""
import argparse
import gzip
import hashlib
import io
import json
from pathlib import Path, PurePosixPath
import re
import subprocess
import tarfile


def git(*args):
    return subprocess.check_output(['git', *args])


def source_files(ref, version):
    if not re.fullmatch(r'\d+\.\d+\.\d+', version):
        raise ValueError('version must be major.minor.patch')
    files = {}
    with tarfile.open(fileobj=io.BytesIO(git('archive', '--format=tar', ref))) as archive:
        for member in archive.getmembers():
            if member.isdir():
                continue
            if not member.isfile():
                raise ValueError(f'unsupported source entry: {member.name}')
            files[member.name] = (archive.extractfile(member).read(), member.mode)
    if json.loads(files['package.json'][0])['version'] != version:
        raise ValueError('committed package.json version differs from release version')
    for legal in ('LICENSE', 'NOTICE', 'DISCLAIMER'):
        if not files.get(legal, (b'',))[0].strip():
            raise ValueError(f'missing required legal material: {legal}')
    return files


def prepare(ref, version, destination):
    files = source_files(ref, version)
    destination.mkdir(parents=True, exist_ok=True)
    prefix = f'apache-casbin-editor-{version}-incubating-src'
    target = destination / f'{prefix}.tar.gz'
    checksum = target.with_name(target.name + '.sha512')
    if checksum.exists():
        raise FileExistsError(f'checksum already exists: {checksum}')
    epoch = int(git('show', '-s', '--format=%ct', ref))
    # Exclusive creation prevents accidental replacement of a reviewed candidate.
    with target.open('xb') as raw:
        with gzip.GzipFile(filename='', fileobj=raw, mode='wb', mtime=0) as zipped:
            with tarfile.open(fileobj=zipped, mode='w', format=tarfile.PAX_FORMAT) as archive:
                for name, (data, mode) in sorted(files.items()):
                    member = tarfile.TarInfo(f'{prefix}/{name}')
                    member.size, member.mode, member.mtime = len(data), mode, epoch
                    archive.addfile(member, io.BytesIO(data))
    digest = hashlib.sha512(target.read_bytes()).hexdigest()
    with checksum.open('x', encoding='ascii', newline='\n') as output:
        output.write(f'{digest}  {target.name}\n')
    return target, digest


def verify(ref, version, archive_path, expected_hash):
    digest = hashlib.sha512(archive_path.read_bytes()).hexdigest()
    if not re.fullmatch(r'[a-fA-F0-9]{128}', expected_hash) or digest != expected_hash.lower():
        raise ValueError('archive SHA-512 mismatch')
    expected = source_files(ref, version)
    prefix = f'apache-casbin-editor-{version}-incubating-src'
    actual = {}
    with tarfile.open(archive_path, 'r:gz') as archive:
        for member in archive.getmembers():
            path = PurePosixPath(member.name)
            if path.is_absolute() or '..' in path.parts or not path.parts or path.parts[0] != prefix:
                raise ValueError('unsafe or unexpected archive path')
            if member.isdir():
                continue
            name = str(PurePosixPath(*path.parts[1:]))
            if not member.isfile() or name in actual:
                raise ValueError('non-regular or duplicate archive entry')
            actual[name] = (archive.extractfile(member).read(), member.mode)
    if actual != expected:
        raise ValueError('archive contents/modes differ from committed source')
    return digest


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('command', choices=['prepare', 'verify'])
    parser.add_argument('--ref', required=True)
    parser.add_argument('--version', required=True)
    parser.add_argument('--output', type=Path, default=Path('source-dist'))
    parser.add_argument('--archive', type=Path)
    parser.add_argument('--sha512')
    args = parser.parse_args()
    try:
        if args.command == 'prepare':
            path, digest = prepare(args.ref, args.version, args.output)
            print(f'{digest}  {path}')
        else:
            if args.archive is None or args.sha512 is None:
                parser.error('verify requires --archive and --sha512')
            print(verify(args.ref, args.version, args.archive, args.sha512))
    except (ValueError, FileExistsError) as error:
        parser.exit(1, f'{error}\n')


if __name__ == '__main__':
    main()
