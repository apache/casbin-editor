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
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

const translations = {
  en: require('../../messages/en.json'),
  zh: require('../../messages/zh.json'),
  hant: require('../../messages/zh-Hant.json'),
  ja: require('../../messages/ja.json'),
  fr: require('../../messages/fr.json'),
  de: require('../../messages/de.json'),
  es: require('../../messages/es.json'),
  id: require('../../messages/id.json'),
  ko: require('../../messages/ko.json'),
  ru: require('../../messages/ru.json'),
  vi: require('../../messages/vi.json'),
  pt: require('../../messages/pt.json'),
  it: require('../../messages/it.json'),
  ms: require('../../messages/ms.json'),
  tr: require('../../messages/tr.json'),
  ar: require('../../messages/ar.json'),
};

const supportedLangs = Object.keys(translations);

type LangContextType = {
  lang: string;
  setLang: (lang: string) => void;
  t: (key: string) => string;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
};

const LangContext = createContext<LangContextType | undefined>(undefined);

export const LangProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLangState] = useState('en');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlLang = urlParams.get('lang');
    const urlTheme = urlParams.get('theme');
    const savedLang = localStorage.getItem('lang');
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;

    if (urlLang && supportedLangs.includes(urlLang)) {
      setLangState(urlLang);
      localStorage.setItem('lang', urlLang);
    } else if (savedLang && supportedLangs.includes(savedLang)) {
      setLangState(savedLang);
    } else {
      const browserLang = navigator.language.split('-')[0];
      const defaultLang = supportedLangs.includes(browserLang) ? browserLang : 'en';
      setLangState(defaultLang);
      localStorage.setItem('lang', defaultLang);
    }

    if (urlTheme === 'dark' || urlTheme === 'light') {
      setTheme(urlTheme);
      localStorage.setItem('theme', urlTheme);
    } else if (savedTheme) {
      setTheme(savedTheme);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
      localStorage.setItem('theme', prefersDark ? 'dark' : 'light');
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const setLang = (newLang: string) => {
    if (supportedLangs.includes(newLang)) {
      setLangState(newLang);
      localStorage.setItem('lang', newLang);
      const url = new URL(window.location.href);
      url.searchParams.set('lang', newLang);
      window.history.pushState({}, '', url);
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    const url = new URL(window.location.href);
    url.searchParams.set('theme', newTheme);
    window.history.pushState({}, '', url);
  };

  const t = (key: string) => {
    const value = translations[lang][key];
    return value || key;
  };

  if (isLoading) {
    return null;
  }

  return <LangContext.Provider value={{ lang, setLang, t, theme, toggleTheme }}>{children}</LangContext.Provider>;
};

export const useLang = () => {
  const context = useContext(LangContext);
  if (!context) {
    throw new Error('useLang must be used within a LangProvider');
  }
  return context;
};
