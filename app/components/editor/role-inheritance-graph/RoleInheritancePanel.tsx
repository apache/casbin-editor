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

import React from 'react';  
import { RoleInheritanceGraph } from './RoleInheritanceGraph';
import { useLang } from '@/app/context/LangContext';   
  
interface RoleInheritancePanelProps {  
  policy: string;  
  isVisible: boolean;  
  onToggle: () => void;  
}  
  
export const RoleInheritancePanel: React.FC<RoleInheritancePanelProps> = ({  
  policy,  
  isVisible,  
  onToggle  
}) => {
  const { t } = useLang();  
  if (!isVisible) return null;  
  
  return (  
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">  
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-6xl max-h-[90vh] overflow-auto">  
        <div className="flex justify-between items-center mb-4">  
          <h2 className="text-xl font-bold dark:text-white">{t('Role Inheritance Graph')}</h2>  
          <button  
            onClick={onToggle}  
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl"  
          >  
            ×  
          </button>  
        </div>  
        <RoleInheritanceGraph policy={policy} />  
      </div>  
    </div>  
  );
};