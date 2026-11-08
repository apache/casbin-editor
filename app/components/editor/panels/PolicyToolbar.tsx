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

import { useEffect, useRef, useState } from 'react';
import { FileUploadButton } from '@/app/components/editor/common/FileUploadButton';
import { EngineSelector } from '@/app/components/editor/common/EngineSelector';
import { EndpointSelector } from '@/app/components/editor/common/EndpointSelector';
import type { EngineType } from '@/app/config/engineConfig';
import type { VersionInfo } from '@/app/components/hooks/useRemoteEnforcer';

interface PolicyToolbarProps {
  setPolicyPersistent: (content: string) => void;
  selectedEngine: EngineType;
  comparisonEngines: EngineType[];
  handleEngineChange: (newPrimary: EngineType, newComparison: EngineType[]) => void;
  versions: Record<EngineType, VersionInfo>;
  engineGithubLinks: Record<EngineType, string>;
}

export const PolicyToolbar: React.FC<PolicyToolbarProps> = ({
  setPolicyPersistent,
  selectedEngine,
  comparisonEngines,
  handleEngineChange,
  versions,
  engineGithubLinks,
}) => {
  const toolbarRef = useRef<HTMLDivElement | null>(null);
  const [compactMode, setCompactMode] = useState(false);

  // Responsive behavior - use compact mode when space is tight
  useEffect(() => {
    const el = toolbarRef.current;
    if (!el) return;

    const check = () => {
      const w = el.clientWidth || 0;
      // Switch to compact mode when width is less than 500px
      setCompactMode(w < 500);
    };

    const ro = new ResizeObserver(check);
    ro.observe(el);
    check();

    return () => {
      ro.disconnect();
    };
  }, []);

  return (
    <div ref={toolbarRef} className="flex-1 overflow-x-auto min-w-0">
      <div className="text-right mr-4 text-sm flex items-center justify-end gap-2 min-w-max">
        <div className="font-normal text-base">
          <FileUploadButton onFileContent={setPolicyPersistent} accept=".csv" />
        </div>
        <EndpointSelector />
        <EngineSelector
          selectedEngine={selectedEngine}
          comparisonEngines={comparisonEngines}
          onEngineChange={handleEngineChange}
          versions={versions}
          engineGithubLinks={engineGithubLinks}
          compactMode={compactMode}
        />
      </div>
    </div>
  );
};
