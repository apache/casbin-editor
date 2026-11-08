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

import { Diagnostic } from '@codemirror/lint';
import { EditorView } from '@codemirror/view';
import { getError } from '@/app/utils/errorManager';
import { ErrorType } from '@/app/utils/errorHandler';
import { validatePolicy } from '@/app/utils/policyValidator';

function createLinter(errorType: ErrorType) {
  return (view: EditorView): Diagnostic[] => {
    const diagnostics: Diagnostic[] = [];
    const error = getError();

    if (error && error.type === errorType) {
      if (error.line) {
        const line = view.state.doc.line(error.line);
        diagnostics.push({
          from: line.from,
          to: line.to,
          severity: 'error',
          message: error.message,
        });
      } else {
        diagnostics.push({
          from: 0,
          to: view.state.doc.length,
          severity: 'error',
          message: error.message,
        });
      }
    }

    return diagnostics;
  };
}

/**
 * Creates a policy linter that validates policy lines against model definitions
 * @param modelText - The model text to validate against
 * @returns A linter function for CodeMirror
 */
export function createPolicyLinter(modelText: string) {
  return (view: EditorView): Diagnostic[] => {
    const diagnostics: Diagnostic[] = [];
    
    // First, check for enforcement errors from the error manager
    const error = getError();
    if (error && error.type === ErrorType.POLICY) {
      if (error.line) {
        const line = view.state.doc.line(error.line);
        diagnostics.push({
          from: line.from,
          to: line.to,
          severity: 'error',
          message: error.message,
        });
      } else {
        diagnostics.push({
          from: 0,
          to: view.state.doc.length,
          severity: 'error',
          message: error.message,
        });
      }
    }

    // Then, perform policy validation
    const policyText = view.state.doc.toString();
    const validationErrors = validatePolicy(policyText, modelText);
    
    for (const validationError of validationErrors) {
      try {
        const line = view.state.doc.line(validationError.line);
        diagnostics.push({
          from: line.from,
          to: line.to,
          severity: 'error',
          message: validationError.message,
        });
      } catch (e) {
        // Line number might be out of range, skip this error
      }
    }

    return diagnostics;
  };
}

export const casbinLinter = createLinter(ErrorType.MODEL);
export const policyLinter = createLinter(ErrorType.POLICY);
export const requestLinter = createLinter(ErrorType.REQUEST);
