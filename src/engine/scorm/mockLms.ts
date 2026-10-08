import { Scorm2004API, ScormLogEntry } from './types';

/**
 * High-fidelity Mock LMS implementation of SCORM 2004 4th Edition (API_1484_11)
 * Used in local development/preview to test LMS tracking in real-time.
 */
class MockScorm2004LMS implements Scorm2004API {
  private data: Map<string, string> = new Map();
  private logs: ScormLogEntry[] = [];
  private isInitialized = false;
  private isTerminated = false;
  private lastError = '0';
  private listeners: ((logs: ScormLogEntry[]) => void)[] = [];

  constructor() {
    this.resetDefaults();
  }

  public resetDefaults() {
    this.data.clear();
    this.data.set('cmi._version', '1.0');
    this.data.set('cmi.learner_id', 'DEV_INTEGRATOR_01');
    this.data.set('cmi.learner_name', 'Integrator, Developer');
    this.data.set('cmi.completion_status', 'unknown');
    this.data.set('cmi.success_status', 'unknown');
    this.data.set('cmi.score.scaled', '0');
    this.data.set('cmi.score.raw', '0');
    this.data.set('cmi.score.min', '0');
    this.data.set('cmi.score.max', '100');
    this.data.set('cmi.progress_measure', '0');
    this.data.set('cmi.location', '');
    this.data.set('cmi.suspend_data', '');
    this.data.set('cmi.entry', 'ab-initio');
    this.data.set('cmi.mode', 'normal');
    this.data.set('cmi.credit', 'credit');
    this.data.set('cmi.interactions._count', '0');
    this.isInitialized = false;
    this.isTerminated = false;
    this.lastError = '0';
  }

  private addLog(entry: Omit<ScormLogEntry, 'timestamp'>) {
    const fullEntry: ScormLogEntry = {
      ...entry,
      timestamp: new Date().toLocaleTimeString(),
    };
    this.logs.unshift(fullEntry);
    if (this.logs.length > 100) this.logs.pop();
    this.listeners.forEach((cb) => cb([...this.logs]));
  }

  public onLog(callback: (logs: ScormLogEntry[]) => void) {
    this.listeners.push(callback);
    callback([...this.logs]);
    return () => {
      this.listeners = this.listeners.filter((cb) => cb !== callback);
    };
  }

  public getRawData(): Record<string, string> {
    const result: Record<string, string> = {};
    this.data.forEach((val, key) => {
      result[key] = val;
    });
    return result;
  }

  public Initialize(param: string): string {
    if (param !== '') {
      this.lastError = '201'; // General Argument Error
      this.addLog({ action: 'Initialize', result: 'false', diagnostic: 'Parameter must be empty string ""' });
      return 'false';
    }
    if (this.isInitialized) {
      this.lastError = '103'; // Already Initialized
      this.addLog({ action: 'Initialize', result: 'false', diagnostic: 'Already initialized' });
      return 'false';
    }
    this.isInitialized = true;
    this.isTerminated = false;
    this.lastError = '0';
    this.addLog({ action: 'Initialize', result: 'true', diagnostic: 'LMS Connected successfully' });
    return 'true';
  }

  public Terminate(param: string): string {
    if (param !== '') {
      this.lastError = '201';
      return 'false';
    }
    if (!this.isInitialized || this.isTerminated) {
      this.lastError = '112'; // Termination Before Initialization
      return 'false';
    }
    this.isTerminated = true;
    this.lastError = '0';
    this.addLog({ action: 'Terminate', result: 'true', diagnostic: 'LMS Session closed' });
    return 'true';
  }

  public GetValue(element: string): string {
    if (!this.isInitialized) {
      this.lastError = '122'; // Retrieve Data Before Initialization
      this.addLog({ action: 'GetValue', element, result: '', diagnostic: 'Not initialized' });
      return '';
    }
    const val = this.data.get(element) || '';
    this.lastError = '0';
    this.addLog({ action: 'GetValue', element, value: val, result: val });
    return val;
  }

  public SetValue(element: string, value: string): string {
    if (!this.isInitialized) {
      this.lastError = '132'; // Store Data Before Initialization
      this.addLog({ action: 'SetValue', element, value, result: 'false', diagnostic: 'Not initialized' });
      return 'false';
    }

    // Auto-update interaction count
    if (element.startsWith('cmi.interactions.')) {
      const match = element.match(/cmi\.interactions\.(\d+)\./);
      if (match) {
        const index = parseInt(match[1], 10);
        const currentCount = parseInt(this.data.get('cmi.interactions._count') || '0', 10);
        if (index >= currentCount) {
          this.data.set('cmi.interactions._count', (index + 1).toString());
        }
      }
    }

    this.data.set(element, value);
    this.lastError = '0';
    this.addLog({ action: 'SetValue', element, value, result: 'true' });
    return 'true';
  }

  public Commit(param: string): string {
    if (!this.isInitialized) {
      this.lastError = '142'; // Commit Before Initialization
      return 'false';
    }
    this.lastError = '0';
    this.addLog({ action: 'Commit', result: 'true', diagnostic: 'Data persisted to LMS' });
    return 'true';
  }

  public GetLastError(): string {
    return this.lastError;
  }

  public GetErrorString(errorCode: string): string {
    const errorMap: Record<string, string> = {
      '0': 'No error',
      '101': 'General Exception',
      '103': 'Already Initialized',
      '112': 'Termination Before Initialization',
      '122': 'Retrieve Data Before Initialization',
      '132': 'Store Data Before Initialization',
      '142': 'Commit Before Initialization',
      '201': 'General Argument Error',
      '401': 'Undefined Data Model Element',
      '403': 'Data Model Element Value Not Initialized',
      '404': 'Data Model Element Is Read Only',
      '405': 'Data Model Element Is Write Only',
    };
    return errorMap[errorCode] || 'Unknown SCORM Error';
  }

  public GetDiagnostic(errorCode: string): string {
    return `Diagnostic info for error code ${errorCode}`;
  }
}

export const mockLms = new MockScorm2004LMS();
