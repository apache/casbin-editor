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

import { clsx } from 'clsx';
import { FileUploadButton } from '@/app/components/editor/common/FileUploadButton';
import { e, m, p, r } from '@/app/components/hooks/useSetupEnforceContext';

interface RequestToolbarProps {
  setupEnforceContextData: Map<string, string>;
  setupHandleEnforceContextChange: (key: string, value: string) => void;
  setRequestPersistent: (content: string) => void;
}

export const RequestToolbar = ({ setupEnforceContextData, setupHandleEnforceContextChange, setRequestPersistent }: RequestToolbarProps) => {
  const inputClassName = clsx(
    'w-8 px-1.5 py-0.5',
    'border border-border rounded-md',
    'text-sm',
    'focus:outline-none focus:ring-2 focus:ring-primary/50',
    'transition-all',
    'bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100',
  );

  return (
    <div className="flex-1 overflow-x-auto">
      <div className="flex items-center gap-2 min-w-max">
        <div className={'space-x-2'}>
          <input
            className={inputClassName}
            value={setupEnforceContextData.get(r)}
            placeholder={r}
            onChange={(event) => {
              return setupHandleEnforceContextChange(r, event.target.value);
            }}
          />
          <input
            className={inputClassName}
            value={setupEnforceContextData.get(p)}
            placeholder={p}
            onChange={(event) => {
              return setupHandleEnforceContextChange(p, event.target.value);
            }}
          />
          <input
            className={inputClassName}
            value={setupEnforceContextData.get(e)}
            placeholder={e}
            onChange={(event) => {
              return setupHandleEnforceContextChange(e, event.target.value);
            }}
          />
          <input
            className={inputClassName}
            value={setupEnforceContextData.get(m)}
            placeholder={m}
            onChange={(event) => {
              return setupHandleEnforceContextChange(m, event.target.value);
            }}
          />
        </div>
        <FileUploadButton onFileContent={setRequestPersistent} accept=".txt" />
      </div>
    </div>
  );
};
