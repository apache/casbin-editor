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

import { createRequire } from 'module';
import fs from 'node:fs';
import path from 'node:path';
const require = createRequire(import.meta.url);
const casbinVersion = require('./node_modules/casbin/package.json').version;

/** @type {import('next').NextConfig} */
const nextConfig = {
  // reactStrictMode: false,
  
  /**
   * Dynamically set output according to environment variables
   * Use 'export' only at build time, not at development time
   */
  output: process.env.NODE_ENV === 'production' ? 'export' : undefined,

  /**
   * Set base path. This is usually the slug of your repository.
   *
   * @see https://nextjs.org/docs/app/api-reference/next-config-js/basePath
   */
  basePath: "",

  /**
   * Disable server-based image optimization. Next.js does not support
   * dynamic features with static exports.
   *
   * @see https://nextjs.org/docs/pages/api-reference/components/image#unoptimized
   */
  images: {
    unoptimized: true,
  },

  // Static files will be loaded using relative paths.
  assetPrefix: './',
  
  // for casbin browser
  webpack: (config, { isServer, webpack }) => {
    if (!isServer) {
      config.resolve.fallback = { fs: false, ...config.resolve.fallback };
      config.plugins.push({
        apply(compiler) {
          compiler.hooks.done.tap('BrowserLicenseInventory', (stats) => {
            const resources = new Set();
            const visit = (module) => {
              if (module.resource) {
                resources.add(module.resource.split('?')[0]);
              }
              for (const child of module.modules || []) {
                visit(child);
              }
            };
            for (const module of stats.compilation.modules) {
              if (stats.compilation.chunkGraph.getNumberOfModuleChunks(module) > 0) {
                visit(module);
              }
            }
            const destination = path.join(process.cwd(), '.next', 'browser-modules.json');
            fs.mkdirSync(path.dirname(destination), { recursive: true });
            fs.writeFileSync(destination, JSON.stringify([...resources].sort(), null, 2));
          });
        },
      });
    }

    config.plugins.push(
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
      })
    );

    return config;
  },

  env: {
    CASBIN_VERSION: casbinVersion
  }
};

export default nextConfig;
