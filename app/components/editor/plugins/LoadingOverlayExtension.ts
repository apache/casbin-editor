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

import { EditorView, ViewPlugin, ViewUpdate, Decoration, DecorationSet, WidgetType } from '@codemirror/view';

class LoadingWidget extends WidgetType {
  toDOM() {
    const wrap = document.createElement('div');
    wrap.className = 'cm-loading-overlay';
    wrap.style.position = 'absolute';
    wrap.style.top = '0';
    wrap.style.left = '0';
    wrap.style.right = '0';
    wrap.style.bottom = '0';
    wrap.style.display = 'flex';
    wrap.style.alignItems = 'center';
    wrap.style.justifyContent = 'center';
    wrap.style.backgroundColor = '#272822';
    wrap.style.zIndex = '100';

    const spinner = document.createElement('div');
    spinner.className = 'cm-loading-spinner';
    spinner.style.width = '32px';
    spinner.style.height = '32px';
    spinner.style.border = '4px solid #e13c3c';
    spinner.style.borderTopColor = 'transparent';
    spinner.style.borderRadius = '50%';
    spinner.style.animation = 'spin 1s linear infinite';

    const style = document.createElement('style');
    style.textContent = `
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);

    wrap.appendChild(spinner);
    return wrap;
  }
}

export function loadingOverlay(isLoading: boolean) {
  return ViewPlugin.fromClass(
    class {
      decorations: DecorationSet;

      constructor(view: EditorView) {
        this.decorations = this.createDecorations(isLoading);
      }

      update(update: ViewUpdate) {
        if (update.docChanged) {
          this.decorations = this.createDecorations(isLoading);
        }
      }

      createDecorations(loading: boolean) {
        if (!loading) return Decoration.none;

        return Decoration.set([
          Decoration.widget({
            widget: new LoadingWidget(),
            side: 1,
          }).range(0),
        ]);
      }
    },
    {
      decorations: (v) => {
        return v.decorations;
      },
    },
  );
}
