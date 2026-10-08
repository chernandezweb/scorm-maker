/**
 * SCORM 2004 4th Edition Data Model & API Interfaces
 */

export type ScormCompletionStatus = 'completed' | 'incomplete' | 'not attempted' | 'unknown';
export type ScormSuccessStatus = 'passed' | 'failed' | 'unknown';

export interface ScormInteractionData {
  id: string;
  type: 'choice' | 'true-false' | 'matching' | 'performance' | 'sequencing' | 'numeric' | 'other';
  description?: string;
  learnerResponse: string;
  result: 'correct' | 'incorrect' | 'neutral';
  weighting?: number;
  latency?: string; // ISO 8601 duration e.g. PT12S
}

export interface ScormSuspendData {
  currentSlideId: string;
  visitedSlideIds: string[];
  variables: Record<string, any>;
  score: number;
  gamification: {
    points: number;
    inventory: string[];
    badges: string[];
    gameTilePosition?: number;
  };
  quizResults: Record<string, { answered: boolean; correct: boolean; score: number }>;
}

export interface ScormLogEntry {
  timestamp: string;
  action: 'Initialize' | 'Terminate' | 'GetValue' | 'SetValue' | 'Commit' | 'Error';
  element?: string;
  value?: string;
  result?: string;
  diagnostic?: string;
}

export interface Scorm2004API {
  Initialize(param: string): string;
  Terminate(param: string): string;
  GetValue(element: string): string;
  SetValue(element: string, value: string): string;
  Commit(param: string): string;
  GetLastError(): string;
  GetErrorString(errorCode: string): string;
  GetDiagnostic(errorCode: string): string;
}
