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

import { useRef } from 'react';
import clsx from 'clsx';
import { Upload } from 'lucide-react';
import { useLang } from '@/app/context/LangContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/app/components/ui/tooltip';

interface FileUploadButtonProps {
  onFileContent: (content: string) => void;
  accept?: string;
  className?: string;
}

export const FileUploadButton: React.FC<FileUploadButtonProps> = ({ onFileContent, accept = '.txt,.conf,.csv', className }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useLang();
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        onFileContent(content);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      };
      reader.readAsText(file);
    } catch (error) {
      console.error('Error reading file:', error);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={className}>
      <input ref={fileInputRef} type="file" accept={accept} onChange={handleFileChange} className="hidden" />
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={handleClick}
              className={clsx(
                'flex items-center gap-1',
                'rounded-lg',
                'px-2',
                'py-1',
                'border border-primary',
                'text-primary',
                'bg-secondary',
                'hover:bg-primary hover:text-primary-foreground',
                'transition-all duration-200',
                'shadow-sm hover:shadow-md',
              )}
            >
              <Upload className="w-4 h-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent className="bg-white dark:bg-gray-800 text-primary border border-primary shadow-lg">
            <p>{t('Upload File')}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};
