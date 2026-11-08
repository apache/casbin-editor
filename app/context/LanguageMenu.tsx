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

'use client';
import { useEffect, useState } from 'react';
import clsx from 'clsx';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useLang } from '@/app/context/LangContext';

const LanguageMenu = () => {
  const { lang, setLang, theme } = useLang();
  const [mounted, setMounted] = useState(false);

  const languageNames = {
    en: 'English',
    zh: '简体中文',
    hant: '繁體中文',
    ja: '日本語',
    fr: 'Français',
    de: 'Deutsch',
    es: 'Español',
    id: 'Indonesia',
    ko: '한국어',
    ru: 'Русский',
    vi: 'Việt Nam',
    pt: 'Português',
    it: 'Italiano',
    ms: 'Malay',
    tr: 'Turkish',
    ar: 'العربية',
  };

  const handleLangChange = (newLang) => {
    setLang(newLang);
  };

  const currentLanguage = languageNames[lang] || 'Unknown';
  const textClass = clsx(theme === 'dark' ? 'text-gray-200' : 'text-gray-800');
  const iconFilterClass = clsx(theme === 'dark' ? 'filter invert' : '');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <button
          className={clsx(
            'bg-secondary',
            'cursor-pointer',
            'flex items-center',
            'transition-colors duration-200',
            'rounded-lg',
            'px-2 py-1',
            'border border-primary',
            'text-primary',
            'hover:bg-primary hover:text-primary-foreground',
            textClass,
          )}
        >
          <img
            src="LanguageSwitching.svg"
            alt="Language"
            className={clsx('w-6 h-6 mr-1', iconFilterClass)}
            style={{
              transition: 'filter 0.5s',
            }}
          />
          {currentLanguage}
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content sideOffset={5} className="bg-white dark:bg-slate-800 rounded-md p-2 z-10 dropdown-content">
        {Object.keys(languageNames).map((code) => {
          return (
            <DropdownMenu.Item
              key={code}
              onSelect={() => {
                handleLangChange(code);
              }}
              className="p-2 cursor-pointer hover:bg-primary/20 dark:hover:bg-primary/30 rounded transition-colors duration-200 dark:text-gray-200"
            >
              {languageNames[code]}
            </DropdownMenu.Item>
          );
        })}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

export default LanguageMenu;
