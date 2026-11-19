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

import { WidgetType, EditorView, Decoration } from '@codemirror/view';
import { RangeSetBuilder } from '@codemirror/state';

type OpenDrawerCallback = (message: string) => void;
type TranslateFunction = (key: string) => string;

class ButtonWidget extends WidgetType {
  openDrawerCallback: OpenDrawerCallback;
  extractContentCallback: (boxType: string) => string;
  boxType: string;
  t: TranslateFunction;

  constructor(openDrawerCallback: OpenDrawerCallback, extractContentCallback: (boxType: string) => string, boxType: string, t: TranslateFunction) {
    super();
    this.openDrawerCallback = openDrawerCallback;
    this.extractContentCallback = extractContentCallback;
    this.boxType = boxType;
    this.t = t;
  }

  toDOM() {
    const button = document.createElement('button');
    button.className = `flex items-center rounded text-[#5734D3] px-1 border border-[#5734D3] 
      bg-[#efefef] hover:bg-[#5734D3] hover:text-white transition-colors duration-500 
      font-medium whitespace-nowrap overflow-hidden`;
    button.innerHTML = `<img src="openai.svg" alt="" class="w-4 h-4 mr-1" /> ${this.t('Ask AI')}`;
    button.style.position = 'absolute';
    button.style.right = '1px';
    button.style.top = '1px';

    button.addEventListener('click', () => {
      if (this.openDrawerCallback) {
        const extractedContent = this.extractContentCallback(this.boxType);
        this.openDrawerCallback(extractedContent);
      }
    });

    return button;
  }
}

export function buttonPlugin(
  openDrawerCallback: OpenDrawerCallback,
  extractContentCallback: (boxType: string) => string,
  boxType: string,
  t: TranslateFunction,
) {
  return EditorView.decorations.compute([], (state) => {
    const builder = new RangeSetBuilder<Decoration>();
    builder.add(
      0,
      0,
      Decoration.widget({
        widget: new ButtonWidget(openDrawerCallback, extractContentCallback, boxType, t),
      }),
    );
    return builder.finish();
  });
}
