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

import { DEFAULT_ENDPOINT, getEndpoint, getRemoteVersion, remoteEnforcer } from '../app/components/hooks/useRemoteEnforcer';

describe('remote backend protocol', () => {
  const originalFetch = global.fetch;
  const request = { engine: 'go' as const, model: 'model', policy: 'policy', request: 'alice, data1, read' };
  const fetchMock = jest.fn();
  let stored: string | null;

  beforeEach(() => {
    stored = null;
    Object.defineProperty(global, 'window', {
      configurable: true,
      value: { localStorage: { getItem: jest.fn(() => stored) } },
    });
    global.fetch = fetchMock;
    fetchMock.mockReset();
  });

  afterAll(() => {
    global.fetch = originalFetch;
    delete (global as any).window;
  });

  test.each([null, '', 'door.casdoor.com', 'demo.casdoor.com'])('migrates saved endpoint %s', (endpoint) => {
    stored = endpoint;
    expect(getEndpoint()).toBe(DEFAULT_ENDPOINT);
  });

  test('keeps a user-selected backend', () => {
    stored = 'backend.example:8443';
    expect(getEndpoint()).toBe(stored);
  });

  test('works during server rendering and when storage is unavailable', () => {
    delete (global as any).window;
    expect(getEndpoint()).toBe(DEFAULT_ENDPOINT);
    Object.defineProperty(global, 'window', {
      configurable: true,
      get() {
        throw new Error('storage denied');
      },
    });
    expect(getEndpoint()).toBe(DEFAULT_ENDPOINT);
  });

  test.each([true, false])('sends the backend schema and preserves allow=%s', async (allow) => {
    fetchMock.mockResolvedValue({ ok: true, json: async () => ({ allow, explain: ['policy'] }) });
    expect(await remoteEnforcer(request)).toEqual({ allowed: allow, reason: ['policy'], error: null });
    expect(fetchMock).toHaveBeenCalledWith(`https://${DEFAULT_ENDPOINT}/api/enforce`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(request),
    });
  });

  test('handles a backend response without an explanation', async () => {
    fetchMock.mockResolvedValue({ ok: true, json: async () => ({ allow: false }) });
    expect(await remoteEnforcer(request)).toEqual({ allowed: false, reason: [], error: null });
  });

  test.each(['http', 'network', 'json'])('returns an error without allowing when %s fails', async (failure) => {
    if (failure === 'network') {
      fetchMock.mockRejectedValue(new Error('offline'));
    } else {
      fetchMock.mockResolvedValue({
        ok: false,
        status: 503,
        json: async () => {
          if (failure === 'json') {
            throw new Error('invalid JSON');
          }
          return { error: 'backend unavailable' };
        },
      });
    }
    const result = await remoteEnforcer(request);
    expect(result.allowed).toBe(false);
    expect(result.error).toBeTruthy();
  });

  test('requests engine-specific version information from the selected endpoint', async () => {
    stored = 'backend.example:8443';
    fetchMock.mockResolvedValue({ ok: true, json: async () => ({ engineVersion: 'go1.26', libVersion: '3.11.0' }) });
    expect(await getRemoteVersion('go')).toEqual({ engineVersion: 'go1.26', libVersion: '3.11.0' });
    expect(fetchMock).toHaveBeenCalledWith('https://backend.example:8443/api/version?engine=go');
  });
});
