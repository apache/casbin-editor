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

export function parseABACRequest(line: string): any[] {
  let value: string | Record<string, any> = '';
  let objectToken = 0;
  let parseToObject = false;
  const request = [];

  for (let i = 0; i < line.length; i++) {
    if (objectToken === 0 && line[i] === ',') {
      if (parseToObject) {
        value = eval(`(${value})`);
      }
      if (typeof value === 'string') {
        value = value.trim();
      }
      // @ts-ignore
      request.push(value);

      value = '';
      parseToObject = false;
      continue;
    }

    value += line[i];

    if (line[i] === '{') {
      parseToObject = true;
      objectToken++;
      continue;
    }

    if (line[i] === '}') {
      objectToken--;
    }
  }

  if (objectToken !== 0) {
    throw new Error(`invalid request ${line}`);
  }

  if (value) {
    if (parseToObject) {
      value = eval(`(${value})`);
    }
    if (typeof value === 'string') {
      value = value.trim();
    }
    // @ts-ignore
    request.push(value);
  }

  return request;
}
