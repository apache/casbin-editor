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

import { NodeCasbinEngine } from '../app/components/editor/core/CasbinEngine';
import { example } from '../app/components/editor/casbin-mode/example';

describe('bundled local engine', () => {
  test('enforces and denies without an explicit enforcement context', async () => {
    const engine = new NodeCasbinEngine();
    const params = { ...example.basic, policy: 'p, alice, data1, read' };
    expect((await engine.enforce({ ...params, request: 'alice, data1, read' })).allowed).toBe(true);
    expect((await engine.enforce({ ...params, request: 'bob, data1, read' })).allowed).toBe(false);
  });

  test('preserves an explicitly selected named enforcement context', async () => {
    const engine = new NodeCasbinEngine();
    const model = `[request_definition]
r = sub, obj, act
r2 = sub, obj, act
[policy_definition]
p = sub, obj, act
p2 = sub, obj, act
[policy_effect]
e = some(where (p.eft == allow))
[matchers]
m = false
m2 = r2.sub == p2.sub && r2.obj == p2.obj && r2.act == p2.act`;
    const enforceContextData = new Map([
      ['r', 'r2'],
      ['p', 'p2'],
      ['e', 'e'],
      ['m', 'm2'],
    ]);
    const result = await engine.enforce({ model, policy: 'p2, alice, data1, read', request: 'alice, data1, read', enforceContextData });
    expect(result.allowed).toBe(true);
  });
});
