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

const fs = require('fs');
const os = require('os');
const path = require('path');
const { getExportedFile } = require('../desktopPaths');

describe('desktop static export paths', () => {
  const exportRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'casbin-editor-paths-'));

  beforeAll(() => {
    fs.mkdirSync(path.join(exportRoot, '_next'));
    fs.writeFileSync(path.join(exportRoot, 'index.html'), 'editor');
    fs.writeFileSync(path.join(exportRoot, 'gallery.html'), 'gallery');
    fs.writeFileSync(path.join(exportRoot, 'github.svg'), '<svg/>');
    fs.writeFileSync(path.join(exportRoot, '_next', 'chunk.js'), 'chunk');
  });

  afterAll(() => {
    fs.rmSync(exportRoot, { recursive: true });
  });

  test.each([
    ['app://editor/', 'index.html'],
    ['app://editor/gallery', 'gallery.html'],
    ['app://editor/github.svg', 'github.svg'],
    ['app://editor/_next/chunk.js?v=1', '_next/chunk.js'],
  ])('serves %s from the exported bundle', (url, file) => {
    expect(getExportedFile(url, exportRoot)).toBe(path.join(exportRoot, file));
  });

  test.each([
    'https://editor/github.svg',
    'app://other/github.svg',
    'app://editor/%2e%2e%2foutside.txt',
    'app://editor/%5coutside.txt',
    'app://editor/%00outside.txt',
    'app://editor/%E0%A4',
    'invalid url',
    'app://editor/missing.js',
  ])('does not serve %s', (url) => {
    expect(getExportedFile(url, exportRoot)).toBeNull();
  });
});
