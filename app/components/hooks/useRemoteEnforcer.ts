// Copyright 2024 The casbin Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import type { EngineType } from '@/app/config/engineConfig';

interface RemoteEnforcerProps {
  model: string;
  policy: string;
  request: string;
  engine: Exclude<EngineType, 'node'>;
}

export interface VersionInfo {
  engineVersion: string;
  libVersion: string;
}

// Host of the casbin-editor-backend service (github.com/casbin/casbin-editor-backend).
export const DEFAULT_ENDPOINT = 'cli.casnode.com';

// Endpoints saved by older versions; they no longer serve the editor.
const LEGACY_ENDPOINTS = ['door.casdoor.com', 'demo.casdoor.com'];

export const getEndpoint = () => {
  try {
    const endpoint = window?.localStorage?.getItem('casbinEndpoint');
    if (!endpoint || LEGACY_ENDPOINTS.includes(endpoint)) {
      return DEFAULT_ENDPOINT;
    }
    return endpoint;
  } catch {
    return DEFAULT_ENDPOINT;
  }
};

export async function remoteEnforcer(props: RemoteEnforcerProps) {
  try {
    const response = await fetch(`https://${getEndpoint()}/api/enforce`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        engine: props.engine,
        model: props.model,
        policy: props.policy,
        request: props.request,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || `HTTP error! status: ${response.status}`);
    }

    return {
      allowed: result.allow,
      reason: result.explain ? result.explain : [],
      error: null,
    };
  } catch (error) {
    return {
      allowed: false,
      reason: ['Error occurred during enforcement'],
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

export async function getRemoteVersion(language: Exclude<EngineType, 'node'>): Promise<VersionInfo> {
  try {
    const url = new URL(`https://${getEndpoint()}/api/version`);
    url.searchParams.set('engine', language);

    const response = await fetch(url.toString());
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || `HTTP error! status: ${response.status}`);
    }

    return {
      engineVersion: result.engineVersion || 'unknown',
      libVersion: result.libVersion || 'unknown',
    };
  } catch (error) {
    console.error(`Error getting ${language} version:`, error);
    return {
      engineVersion: 'unknown',
      libVersion: 'unknown',
    };
  }
}
