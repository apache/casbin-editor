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
const path = require('path');

const getExportedFile = (url, exportRoot) => {
  let request;
  let pathname;
  try {
    request = new URL(url);
    pathname = decodeURIComponent(request.pathname);
  } catch {
    return null;
  }
  if (request.protocol !== 'app:' || request.host !== 'editor' || request.username || request.password) {
    return null;
  }

  if (pathname.includes('\\') || pathname.includes('\0') || pathname.split('/').includes('..')) {
    return null;
  }

  const file = path.resolve(exportRoot, `.${pathname}`);
  const relative = path.relative(exportRoot, file);
  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    return null;
  }

  return (
    [file, `${file}.html`, path.join(file, 'index.html')].find((candidate) => {
      return fs.existsSync(candidate) && fs.statSync(candidate).isFile();
    }) || null
  );
};

module.exports = { getExportedFile };
