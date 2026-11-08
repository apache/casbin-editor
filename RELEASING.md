<!--
Licensed to the Apache Software Foundation (ASF) under one
or more contributor license agreements. See the NOTICE file
distributed with this work for additional information
regarding copyright ownership. The ASF licenses this file
to you under the Apache License, Version 2.0 (the
"License"); you may not use this file except in compliance
with the License. You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing,
software distributed under the License is distributed on an
"AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, either express or implied. See the License for the
specific language governing permissions and limitations
under the License.
-->

# Releasing Apache Casbin Editor (Incubating)

The source distribution is the Apache release. Website deployment and Electron
convenience binaries are separate distribution channels.

Use Node.js 22.12 or newer to install and build the application, as required by
the Electron development dependency. CI uses Node.js 22.

1. Commit the selected version in `package.json`. Complete source, dependency,
   licensing, tests and distribution review, and merge the focused changes.
2. Create an RC tag such as `v1.101.0-rc1`. The source workflow creates an
   **unsigned workflow artifact**, not an approved release or public download.
   Download it and verify the exact committed source:

   ```sh
   python scripts/release_source.py verify --ref v1.101.0-rc1 --version 1.101.0 \
     --archive apache-casbin-editor-1.101.0-incubating-src.tar.gz --sha512 <reviewed-sha512>
   ```

3. Review the final archive, build/test a fresh extraction, sign it using the
   release manager's key listed in the official Casbin KEYS, and stage the
   archive, detached `.asc` and `.sha512` in the ASF **dev** distribution area.
   Independently download and verify them before starting the votes.
4. Obtain project endorsement and binding IPMC approval for those exact bytes.
   Preserve independent ballots/results for this component even in a combined
   vote email. A changed candidate needs a new RC and applicable fresh votes.
5. Promote the approved originals from ASF dev to the ASF release area. Verify
   public signatures/checksums and the download links. Do not regenerate archives.
6. Create the final version tag at the approved commit. Final tags do not run a
   publication workflow. A release manager may create the GitHub release after
   verifying the approvals and attach the **downloaded approved originals**,
   including their signature/checksum, without overwriting existing assets.
   Include the full DISCLAIMER, official source and verification links, and the
   project/IPMC result URLs in the release description.

The standard Electron distribution includes `ffmpeg.dll` (or its platform
equivalent), whose bundled Chromium license identifies FFmpeg as LGPL-2.1+.
The [ASF third-party policy](https://www.apache.org/legal/resolved.html#category-x)
prohibits distributing Category X components in ASF convenience binaries.
Keeping the Electron/Chromium license files does not resolve that restriction.
Do not upload the standard Electron bundle as an Apache release asset. Local
desktop builds remain available; the web application does not require Electron.
An ASF desktop distribution needs a reviewed compatible runtime/build and its
actual component inventory before it can proceed. Do not assume that removing
one DLL produces a working or license-compliant Electron runtime.

Any future approved Electron builds must use a fresh extraction of the approved source, the frozen
lock and the committed version. Verify the packaged source correspondence,
browser dependency license texts, Electron/Chromium licenses, DISCLAIMER and
NOTICE before adding convenience binaries. Do not publish from electron-builder:
use `yarn dist --publish never`. Do not rebuild or replace the approved source
when producing desktop packages, and never attach pre-vote desktop builds to a
final release. Platform checks and signing must be recorded for each binary.

ASF staging, final promotion, signing and GitHub publication require distinct
permissions. No script or successful CI run constitutes approval or verifies
those permissions. Historical GitHub desktop downloads predate this process;
they are not evidence that a new candidate has been approved.

The current build workflow does not deploy a website. An asf-site deployment or
external hosting change must be reviewed and executed as a separate operation.
