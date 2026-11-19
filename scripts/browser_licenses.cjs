// Licensed to the Apache Software Foundation (ASF) under one
// or more contributor license agreements. See the NOTICE file
// distributed with this work for additional information
// regarding copyright ownership. The ASF licenses this file
// to you under the Apache License, Version 2.0 (the
// "License"); you may not use this file except in compliance
// with the License. You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing,
// software distributed under the License is distributed on an
// "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
// KIND, either express or implied. See the License for the
// specific language governing permissions and limitations
// under the License.

// Use actual browser compiler resources, including Next.js' vendored modules.
// The report is evidence for review, not a legal-clearance verdict.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const root = process.cwd();
const modulesRoot = fs.realpathSync(path.join(root, 'node_modules'));
const output = path.join(root, 'out', 'third-party-licenses');
const resources = JSON.parse(fs.readFileSync('.next/browser-modules.json', 'utf8'));
const components = new Map();
const supplements = JSON.parse(fs.readFileSync('licenses/browser-supplements.json', 'utf8'));
const slash = (value) => value.split(path.sep).join('/');

function add(resource, generated = false) {
  const actual = fs.realpathSync(resource);
  const moduleRelative = path.relative(modulesRoot, actual);
  if (moduleRelative.startsWith('..') || path.isAbsolute(moduleRelative)) return;
  const relative = `node_modules/${slash(moduleRelative)}`;
  let directory = path.dirname(actual);
  let manifest;
  while (directory.startsWith(modulesRoot)) {
    const candidate = path.join(directory, 'package.json');
    if (fs.existsSync(candidate)) {
      const candidateManifest = JSON.parse(fs.readFileSync(candidate, 'utf8'));
      // Some ESM subdirectories have only {"type":"module"}; their package
      // identity and license remain at the enclosing named package boundary.
      if (candidateManifest.name) {
        manifest = candidateManifest;
        break;
      }
    }
    directory = path.dirname(directory);
  }
  if (!manifest) throw new Error(`No package identity for ${relative}`);
  const key = `node_modules/${slash(path.relative(modulesRoot, directory))}`;
  if (!components.has(key)) {
    const legalFiles = fs
      .readdirSync(directory)
      .filter(
        (file) =>
          /^(?:licen[cs]e|copying|notice|copyrightnotice)(?:\.|$)|\.licen[cs]e(?:\.|$)/i.test(file) &&
          fs.statSync(path.join(directory, file)).isFile(),
      );
    const supplement = supplements[`${manifest.name}@${manifest.version}`];
    if (!legalFiles.length && !supplement) throw new Error(`No license text for browser component ${key}`);
    components.set(key, {
      name: manifest.name || key,
      version: manifest.version || `vendored by next@${require('next/package.json').version}`,
      declaredLicense: manifest.license || 'See retained license texts',
      directory,
      resources: [],
      legalFiles,
      supplement,
    });
  }
  components.get(key).resources.push({ path: relative, generated });
}

for (const resource of resources) add(resource);
// Webpack emits its runtime and Tailwind emits plugin CSS, without file-backed
// module resources in the browser graph. Retain their originating license texts.
for (const relative of [
  'node_modules/next/dist/compiled/webpack/webpack.js',
  'node_modules/tailwindcss/lib/index.js',
  'node_modules/tailwindcss-animate/index.js',
])
  add(path.join(root, relative), true);

fs.mkdirSync(output, { recursive: true });
const report = [];
for (const [key, component] of [...components].sort(([a], [b]) => a.localeCompare(b))) {
  const slug = key.replaceAll('/', '__');
  const destination = path.join(output, slug);
  fs.mkdirSync(destination, { recursive: true });
  const files = component.legalFiles.map((file) => {
    const bytes = fs.readFileSync(path.join(component.directory, file));
    fs.writeFileSync(path.join(destination, file), bytes);
    return { path: `${slug}/${file}`, sha512: crypto.createHash('sha512').update(bytes).digest('hex') };
  });
  if (component.supplement) {
    const bytes = fs.readFileSync(component.supplement.file);
    const file = path.basename(component.supplement.file);
    fs.writeFileSync(path.join(destination, file), bytes);
    files.push({ path: `${slug}/${file}`, sha512: crypto.createHash('sha512').update(bytes).digest('hex'), source: component.supplement.source });
  }
  report.push({
    name: component.name,
    version: component.version,
    declaredLicense: component.declaredLicense,
    origin: key,
    resources: component.resources,
    legalFiles: files,
  });
}
for (const file of ['LICENSE', 'NOTICE', 'DISCLAIMER']) fs.copyFileSync(file, path.join('out', file));
fs.cpSync('licenses', path.join('out', 'licenses'), { recursive: true });
fs.appendFileSync(
  path.join('out', 'LICENSE'),
  '\nThis static distribution also includes the browser components listed in\n' +
    'third-party-licenses/index.json. Their license and NOTICE texts are retained\n' +
    'under third-party-licenses/ at the paths recorded in that inventory.\n',
);
fs.writeFileSync(path.join(output, 'index.json'), JSON.stringify(report, null, 2) + '\n');
console.log(`Retained legal material for ${report.length} browser components; review the inventory before release.`);
