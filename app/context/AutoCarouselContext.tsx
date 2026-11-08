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
import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

type AutoCarouselContextType = {
  autoCarouselEnabled: boolean;
  setAutoCarouselEnabled: (enabled: boolean) => void;
  disableAutoCarousel: () => void;
};

const AutoCarouselContext = createContext<AutoCarouselContextType | undefined>(undefined);

export const AutoCarouselProvider = ({ children }: { children: ReactNode }) => {
  const [autoCarouselEnabled, setAutoCarouselEnabledState] = useState(() => {
    // Initialize from localStorage if available, otherwise default to true
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('autoCarouselEnabled');
        if (saved !== null) {
          return saved === 'true';
        }
      } catch (error) {
        // If localStorage access fails (e.g., private browsing), use default value
        console.warn('Failed to read from localStorage:', error);
      }
    }
    return true;
  });

  // Save auto carousel state to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('autoCarouselEnabled', String(autoCarouselEnabled));
      } catch (error) {
        // If localStorage is full or unavailable, log but don't crash
        console.warn('Failed to save to localStorage:', error);
      }
    }
  }, [autoCarouselEnabled]);

  const setAutoCarouselEnabled = useCallback((enabled: boolean) => {
    setAutoCarouselEnabledState(enabled);
  }, []);

  const disableAutoCarousel = useCallback(() => {
    setAutoCarouselEnabledState(false);
  }, []);

  return (
    <AutoCarouselContext.Provider value={{ autoCarouselEnabled, setAutoCarouselEnabled, disableAutoCarousel }}>
      {children}
    </AutoCarouselContext.Provider>
  );
};

export const useAutoCarousel = () => {
  const context = useContext(AutoCarouselContext);
  if (!context) {
    throw new Error('useAutoCarousel must be used within an AutoCarouselProvider');
  }
  return context;
};
