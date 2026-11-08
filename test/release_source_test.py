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

"""Exercise release boundaries with a disposable, independent Git repository."""
import hashlib
import importlib.util
import io
import json
import os
from pathlib import Path
import subprocess
import tarfile
import tempfile
import unittest

spec = importlib.util.spec_from_file_location('release_source', Path(__file__).parents[1] / 'scripts/release_source.py')
release = importlib.util.module_from_spec(spec)
spec.loader.exec_module(release)


class SourceReleaseTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.root = Path(self.temp.name)
        self.previous = Path.cwd()
        os.chdir(self.root)
        self.addCleanup(self.temp.cleanup)
        self.addCleanup(os.chdir, self.previous)
        self.git('init', '-q')
        self.git('config', 'user.name', 'Release Test')
        self.git('config', 'user.email', 'test@example.invalid')
        for name in ['LICENSE', 'NOTICE', 'DISCLAIMER']:
            (self.root / name).write_text(name, encoding='utf-8')
        (self.root / 'package.json').write_text(json.dumps({'version': '1.2.3'}), encoding='utf-8')
        self.git('add', '.')
        self.git('commit', '-qm', 'fixture')

    def git(self, *args):
        return subprocess.check_output(['git', *args], stderr=subprocess.STDOUT)

    def test_reproducible_and_uses_committed_bytes(self):
        (self.root / 'package.json').write_text('uncommitted edits', encoding='utf-8')
        first, digest = release.prepare('HEAD', '1.2.3', self.root / 'one')
        second, second_digest = release.prepare('HEAD', '1.2.3', self.root / 'two')
        self.assertEqual(first.read_bytes(), second.read_bytes())
        self.assertEqual(digest, second_digest)
        self.assertEqual(release.verify('HEAD', '1.2.3', first, digest), digest)

    def test_refuses_version_mismatch_and_missing_legal(self):
        with self.assertRaisesRegex(ValueError, 'version differs'):
            release.prepare('HEAD', '2.0.0', self.root / 'wrong')
        self.git('rm', 'NOTICE')
        self.git('commit', '-qm', 'remove legal fixture')
        with self.assertRaisesRegex(ValueError, 'legal material'):
            release.prepare('HEAD', '1.2.3', self.root / 'missing')

    def test_does_not_overwrite_existing_candidate(self):
        release.prepare('HEAD', '1.2.3', self.root / 'out')
        with self.assertRaises(FileExistsError):
            release.prepare('HEAD', '1.2.3', self.root / 'out')

    def test_does_not_overwrite_preexisting_checksum(self):
        destination = self.root / 'out'
        destination.mkdir()
        checksum = destination / 'apache-casbin-editor-1.2.3-incubating-src.tar.gz.sha512'
        checksum.write_text('reviewed checksum', encoding='ascii')
        with self.assertRaises(FileExistsError):
            release.prepare('HEAD', '1.2.3', destination)
        self.assertEqual(checksum.read_text(encoding='ascii'), 'reviewed checksum')
        self.assertFalse(checksum.with_suffix('').exists())

    def test_rejects_wrong_hash_and_changed_contents(self):
        archive, digest = release.prepare('HEAD', '1.2.3', self.root / 'out')
        with self.assertRaisesRegex(ValueError, 'SHA-512'):
            release.verify('HEAD', '1.2.3', archive, '0' * 128)
        self.git('rm', 'NOTICE')
        self.git('commit', '-qm', 'change reviewed tree')
        with self.assertRaises(ValueError):
            release.verify('HEAD', '1.2.3', archive, digest)

    def test_rejects_traversal_links_and_duplicate_entries(self):
        for names, kind in [(['../escape'], 'file'), (['NOTICE'], 'symlink'), (['NOTICE', 'NOTICE'], 'file')]:
            archive = self.root / 'unsafe.tar.gz'
            with tarfile.open(archive, 'w:gz') as output:
                for name in names:
                    item = tarfile.TarInfo('apache-casbin-editor-1.2.3-incubating-src/' + name)
                    if kind == 'symlink':
                        item.type, item.linkname = tarfile.SYMTYPE, '/etc/passwd'
                        output.addfile(item)
                    else:
                        item.size = 1
                        output.addfile(item, io.BytesIO(b'x'))
            digest = hashlib.sha512(archive.read_bytes()).hexdigest()
            with self.assertRaises(ValueError):
                release.verify('HEAD', '1.2.3', archive, digest)


if __name__ == '__main__':
    unittest.main()
