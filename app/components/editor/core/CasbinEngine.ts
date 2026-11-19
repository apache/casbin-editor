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

import { newEnforcer, newModel, StringAdapter } from 'casbin';
import { remoteEnforcer, getRemoteVersion, VersionInfo } from '@/app/components/hooks/useRemoteEnforcer';
import { setupRoleManager, setupCustomConfig, processRequests } from '@/app/utils/casbinEnforcer';
import type { EngineType } from '@/app/config/engineConfig';

interface EnforceResult {
  allowed: boolean;
  reason: string[];
  error: string | null;
}

export interface ICasbinEngine {
  enforce(params: {
    model: string;
    policy: string;
    request: string;
    customConfig?: string;
    enforceContextData?: Map<string, string>;
  }): Promise<EnforceResult>;

  getVersion?(): Promise<VersionInfo>;
}

// Node.js
export class NodeCasbinEngine implements ICasbinEngine {
  async enforce(params) {
    try {
      const e = await newEnforcer(newModel(params.model), params.policy ? new StringAdapter(params.policy) : undefined);

      setupRoleManager(e);

      if (params.customConfig) {
        await setupCustomConfig(e, params.customConfig);
      }

      const results = await processRequests(params.request, e, params.enforceContextData);

      return {
        allowed: results[0].okEx,
        reason: results[0].reason,
        error: null,
      };
    } catch (error) {
      throw error;
    }
  }
}

// RemoteCasbinEngine
export class RemoteCasbinEngine implements ICasbinEngine {
  constructor(private engine: Exclude<EngineType, 'node'>) {}

  async enforce(params) {
    try {
      const result = await remoteEnforcer({
        model: params.model,
        policy: params.policy,
        request: params.request,
        engine: this.engine,
      });

      if (result.error) {
        throw new Error(result.error);
      }

      return {
        allowed: result.allowed,
        reason: result.reason,
        error: null,
      };
    } catch (error) {
      throw error;
    }
  }

  async getVersion(): Promise<VersionInfo> {
    return getRemoteVersion(this.engine);
  }
}

export function createCasbinEngine(type: EngineType): ICasbinEngine {
  if (type === 'node') {
    return new NodeCasbinEngine();
  }
  return new RemoteCasbinEngine(type);
}
