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

export enum ErrorType {
  MODEL = 'model',
  POLICY = 'policy',
  REQUEST = 'request',
  UNKNOWN = 'unknown',
}

interface ErrorDetector {
  type: ErrorType;
  detect: (error: string) => boolean;
}

// Request
const REQUEST_ERROR_PATTERNS = [] as const;

// Policy
const POLICY_ERROR_PATTERNS = [] as const;

// Model
const MODEL_ERROR_PATTERNS = ['missing required sections'] as const;

export const errorDetectors: ErrorDetector[] = [
  {
    type: ErrorType.REQUEST,
    detect: (error: string) => {
      return (
        REQUEST_ERROR_PATTERNS.some((pattern) => {
          return error.toLowerCase().includes(pattern);
        }) || error.toLowerCase().includes('rvals:')
      );
    },
  },
  {
    type: ErrorType.POLICY,
    detect: (error: string) => {
      return POLICY_ERROR_PATTERNS.some((pattern) => {
        return error.toLowerCase().includes(pattern);
      });
    },
  },
  {
    type: ErrorType.MODEL,
    detect: (error: string) => {
      return (
        MODEL_ERROR_PATTERNS.some((pattern) => {
          return error.toLowerCase().includes(pattern);
        }) ||
        (!error.toLowerCase().includes('request') && !error.toLowerCase().includes('policy') && !error.toLowerCase().includes('rvals:'))
      );
    },
  },
];

export function getErrorType(error: string): ErrorType {
  for (const detector of errorDetectors) {
    if (detector.detect(error)) {
      return detector.type;
    }
  }
  return ErrorType.UNKNOWN;
}

export interface ErrorHandlers {
  onModelError?: (error: string) => void;
  onPolicyError?: (error: string) => void;
  onRequestError?: (error: string) => void;
  onUnknownError?: (error: string) => void;
}

export function handleError(error: string, handlers: ErrorHandlers): void {
  const errorType = getErrorType(error);

  switch (errorType) {
    case ErrorType.MODEL:
      handlers.onModelError?.(error);
      break;
    case ErrorType.POLICY:
      handlers.onPolicyError?.(error);
      break;
    case ErrorType.REQUEST:
      handlers.onRequestError?.(error);
      break;
    case ErrorType.UNKNOWN:
      handlers.onUnknownError?.(error);
      break;
  }
}
