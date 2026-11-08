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

import { EngineType, ENGINES } from '@/app/config/engineConfig';

interface EngineResultData {
  result: string;
  reason?: string[];
}

export interface ResultsMap {
  [key: string]: EngineResultData;
}

export function formatEngineResults(results: ResultsMap, selectedEngine: EngineType): string {
  const entries = Object.entries(results);
  if (entries.length === 1) return entries[0][1].result;

  return entries
    .sort((a, b) => {
      if (a[0] === selectedEngine) return -1;
      if (b[0] === selectedEngine) return 1;
      return ENGINES[a[0] as EngineType].order - ENGINES[b[0] as EngineType].order;
    })
    .map(([engine, data]) => {
      return formatSingleResult(engine, data, engine === selectedEngine);
    })
    .join('\n\n');
}

function formatSingleResult(engine: string, data: EngineResultData, isPrimary: boolean): string {
  return [
    `// ${isPrimary ? '🟢' : '⚪️'} ${engine} Engine Result`,
    data.result,
    `// ${isPrimary ? '========================' : '----------------------------------------'}`,
  ].join('\n');
}

export function formatResults(results: any[]): string {
  return results
    .map((res) => {
      if (typeof res === 'object') {
        const reasonString = Array.isArray(res.reason) && res.reason.length > 0 ? ` Reason: ${JSON.stringify(res.reason)}` : '';
        return `${res.okEx}${reasonString}`;
      }
      return res;
    })
    .join('\n');
}

export function createResultsMap(results: Array<{ engine: string; result: string }>): ResultsMap {
  return results.reduce((acc, { engine, result }) => {
    acc[engine] = { result };
    return acc;
  }, {} as ResultsMap);
}
