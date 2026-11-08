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

import type { Metadata } from 'next';
import './globals.css';
import { LangProvider } from './context/LangContext';
import { AutoCarouselProvider } from './context/AutoCarouselContext';

export const metadata: Metadata = {
  title: 'Apache Casbin Editor (Incubating)',
  description: 'Apache Casbin (Incubating) model and policy editor',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <LangProvider>
          <AutoCarouselProvider>{children}</AutoCarouselProvider>
          <footer className="px-4 py-2 text-center text-xs text-slate-500">
            Apache Casbin is an effort undergoing incubation at The Apache Software Foundation (ASF),
            sponsored by the Apache Incubator. Incubation is required of all newly accepted projects
            until a further review indicates that the infrastructure, communications, and decision
            making process have stabilized in a manner consistent with other successful ASF projects.
            While incubation status is not necessarily a reflection of the completeness or stability
            of the code, it does indicate that the project has yet to be fully endorsed by the ASF.
            <p className="mt-1">
              Gopher artwork based on work by{' '}
              <a href="https://go.dev/blog/gopher" className="underline">Renee French</a>{' '}
              (<a href="https://creativecommons.org/licenses/by/4.0/" className="underline">CC BY 4.0</a>),
              adapted by the Casbin community.
            </p>
          </footer>
        </LangProvider>
      </body>
    </html>
  );
}
