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

# Included source material

The adapted `sheet.tsx`, `tooltip.tsx` and `utils.ts` UI utilities retain
shadcn/ui's MIT terms in `shadcn-MIT.txt`. Reference implementation and license:
https://github.com/shadcn-ui/ui/tree/shadcn%402.3.0/apps/www/registry/default/ui
and https://github.com/shadcn-ui/ui/blob/main/LICENSE.md.

The eight SVG files under `public/` are derived from the icon node data in
lucide-react 0.473.0: languages, columns-2, message-circle, github, layout-grid,
moon, sparkles and sun, respectively. Their ISC and Feather MIT terms are in
`lucide.txt`; the copyright ranges are retained from Lucide's license. The MIT
permission text is also available in https://github.com/feathericons/feather/blob/v4.29.2/LICENSE.
These replace the previous icons whose origin was not recorded.

The identical `app/icon.png` and `public/favicon.png` are the Casbin project
favicon introduced in commit f6ba93d91ae3586f19b2c90599cfbaa9bf76b5a1 (2019-11-17),
retained as binary project artwork. They depict an adaptation of the Go gopher.
The original gopher is by Renee French under CC BY 4.0 (see the Go project's
https://go.dev/blog/gopher and `CC-BY-4.0.txt`). Casbin adds the shield/check mark.
The source LICENSE/NOTICE and rendered footer retain this attribution.

Dependencies downloaded during a build are not bundled with the source archive.
The production build inventories actual browser module inputs, retains their
license and NOTICE files under `out/third-party-licenses/`, and copies this
directory and the project legal files into the static output. This generated
inventory needs release review; manifest license strings alone are not clearance.

Some npm distributions omit their upstream license file. Version-bound entries
in `browser-supplements.json` retain the missing texts from identified upstream
revisions. In particular, react-remove-scroll-bar 2.3.8 has the same published
`dist/` JavaScript and declaration bytes as 2.3.7; the retained upstream MIT text
is from commit 8ca9ba5ea52de03308fe8ced94f7b159a44d28ff (manifest 2.3.7).
The reported 2.3.8 npm gitHead was unavailable in that repository, so it is not
used as license provenance. The source URL and copied text hash are retained
in the generated browser inventory.

The strict JSON manifests, configuration and translation dictionaries cannot
contain comments; the project LICENSE applies to the contributed JSON data.
`yarn.lock` is generated dependency-resolution data and `.nojekyll` is an empty
hosting marker. These formats are reviewed separately from source headers.

The supplementary node-ip 1.1.5 MIT terms are retained from that exact npm
package's README (it does not contain a separate LICENSE file). They apply
to the adapted IP implementation in the generated casbin 5.51.1 browser code;
the source distribution contains only the supplementary license text.
