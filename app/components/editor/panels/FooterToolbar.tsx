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
import { ActionToolbar } from '@/app/components/editor/panels/ActionToolbar';
import { MessageWithTooltip } from '@/app/components/editor/common/MessageWithTooltip';
import LanguageMenu from '@/app/context/LanguageMenu';

const FooterToolbar = ({
  runTest,
  shareInfo,
  handleShare,
  modelKind,
  modelText,
  policy,
  customConfig,
  request,
  enforceContextData,
  selectedEngine,
  comparisonEngines,
  echo,
  textClass,
  toggleTheme,
  theme,
  requestResult,
}) => {
  return (
    <div className={clsx('pt-2 px-1 flex flex-col sm:flex-row items-start sm:items-center')}>
      <ActionToolbar
        runTest={runTest}
        shareInfo={shareInfo}
        handleShare={handleShare}
        modelKind={modelKind}
        modelText={modelText}
        policy={policy}
        customConfig={customConfig}
        request={request}
        enforceContextData={enforceContextData}
        selectedEngine={selectedEngine}
        comparisonEngines={comparisonEngines}
        requestResult={requestResult}
      />
      <div className="flex flex-row justify-between items-center w-full sm:w-auto sm:ml-auto mt-2 sm:mt-0">
        <MessageWithTooltip message={echo} className={textClass} />
        <div className="flex flex-row items-center ml-auto sm:ml-3">
          <button
            onClick={toggleTheme}
            aria-label={theme !== 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className={clsx(
              'theme-toggle-button mr-2 p-2 rounded-lg',
              'hover:bg-secondary/50 hover:border hover:border-primary/30',
              'transition-all duration-200 hover:shadow-md',
            )}
          >
            <img
              src={theme !== 'dark' ? 'sun.svg' : 'moon.svg'}
              alt={theme !== 'dark' ? 'Light mode' : 'Dark mode'}
              className="w-5 h-5 transition-opacity duration-300"
              style={{ filter: theme === 'dark' ? 'invert(1)' : 'invert(0)' }}
            />
          </button>
          <LanguageMenu />
        </div>
      </div>
    </div>
  );
};
export default FooterToolbar;
