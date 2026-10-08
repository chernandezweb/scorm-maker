import { mockLms } from './mockLms';
import {
  Scorm2004API,
  ScormCompletionStatus,
  ScormSuccessStatus,
  ScormInteractionData,
  ScormSuspendData,
} from './types';

declare global {
  interface Window {
    API_1484_11?: Scorm2004API;
  }
}

class Scorm2004Client {
  private api: Scorm2004API | null = null;
  private isConnected = false;
  private startTime: number = Date.now();
  private interactionIndex = 0;

  constructor() {
    this.findAPI();
  }

  private findAPI(): Scorm2004API | null {
    if (this.api) return this.api;

    let currentWindow: Window | null = window;
    let attempts = 0;

    // 1. Traverse parent windows
    while (currentWindow && attempts < 20) {
      if (currentWindow.API_1484_11) {
        this.api = currentWindow.API_1484_11;
        return this.api;
      }
      if (currentWindow === currentWindow.parent) break;
      currentWindow = currentWindow.parent;
      attempts++;
    }

    // 2. Check window opener
    if (window.opener && window.opener.API_1484_11) {
      this.api = window.opener.API_1484_11;
      return this.api;
    }

    // 3. Fallback: Local Development Mock LMS
    console.warn('[SCORM 2004] No host LMS API_1484_11 found. Initializing built-in Mock LMS.');
    window.API_1484_11 = mockLms;
    this.api = mockLms;
    return this.api;
  }

  public initialize(): boolean {
    const api = this.findAPI();
    if (!api) return false;

    const res = api.Initialize('');
    this.isConnected = res === 'true';
    this.startTime = Date.now();

    // Check existing interaction count from LMS
    const countStr = this.getValue('cmi.interactions._count');
    if (countStr && !isNaN(parseInt(countStr, 10))) {
      this.interactionIndex = parseInt(countStr, 10);
    }

    return this.isConnected;
  }

  public terminate(): boolean {
    if (!this.isConnected || !this.api) return false;
    this.recordSessionTime();
    this.commit();
    const res = this.api.Terminate('');
    this.isConnected = false;
    return res === 'true';
  }

  public commit(): boolean {
    if (!this.isConnected || !this.api) return false;
    return this.api.Commit('') === 'true';
  }

  public getValue(element: string): string {
    if (!this.api) return '';
    return this.api.GetValue(element);
  }

  public setValue(element: string, value: string): boolean {
    if (!this.api) return false;
    return this.api.SetValue(element, value) === 'true';
  }

  public setCompletionStatus(status: ScormCompletionStatus): boolean {
    const success = this.setValue('cmi.completion_status', status);
    this.commit();
    return success;
  }

  public setSuccessStatus(status: ScormSuccessStatus): boolean {
    const success = this.setValue('cmi.success_status', status);
    this.commit();
    return success;
  }

  public setScore(raw: number, min = 0, max = 100): boolean {
    const scaled = max > min ? Math.max(-1, Math.min(1, (raw - min) / (max - min))) : 0;
    this.setValue('cmi.score.raw', raw.toString());
    this.setValue('cmi.score.min', min.toString());
    this.setValue('cmi.score.max', max.toString());
    this.setValue('cmi.score.scaled', scaled.toFixed(2));
    return this.commit();
  }

  public setLocation(slideId: string): boolean {
    return this.setValue('cmi.location', slideId);
  }

  public getLocation(): string {
    return this.getValue('cmi.location');
  }

  public setProgressMeasure(fraction: number): boolean {
    const clamped = Math.max(0, Math.min(1, fraction));
    return this.setValue('cmi.progress_measure', clamped.toFixed(2));
  }

  public saveSuspendData(data: ScormSuspendData): boolean {
    try {
      const serialized = JSON.stringify(data);
      // SCORM 2004 4th Edition allows up to 64,000 characters
      if (serialized.length > 64000) {
        console.warn('[SCORM 2004] suspend_data exceeds 64,000 characters!');
      }
      const success = this.setValue('cmi.suspend_data', serialized);
      this.commit();
      return success;
    } catch (e) {
      console.error('[SCORM 2004] Failed to serialize suspend_data:', e);
      return false;
    }
  }

  public loadSuspendData(): ScormSuspendData | null {
    const raw = this.getValue('cmi.suspend_data');
    if (!raw) return null;
    try {
      return JSON.parse(raw) as ScormSuspendData;
    } catch (e) {
      console.error('[SCORM 2004] Failed to parse suspend_data JSON:', e);
      return null;
    }
  }

  public recordInteraction(interaction: ScormInteractionData): boolean {
    const idx = this.interactionIndex++;
    const prefix = `cmi.interactions.${idx}`;

    this.setValue(`${prefix}.id`, interaction.id);
    this.setValue(`${prefix}.type`, interaction.type);
    if (interaction.description) {
      this.setValue(`${prefix}.description`, interaction.description);
    }
    this.setValue(`${prefix}.learner_response`, interaction.learnerResponse);
    this.setValue(`${prefix}.result`, interaction.result);
    if (interaction.weighting !== undefined) {
      this.setValue(`${prefix}.weighting`, interaction.weighting.toString());
    }
    if (interaction.latency) {
      this.setValue(`${prefix}.latency`, interaction.latency);
    }

    return this.commit();
  }

  public recordSessionTime(): void {
    const elapsedSeconds = Math.floor((Date.now() - this.startTime) / 1000);
    const duration = this.secondsToIsoDuration(elapsedSeconds);
    this.setValue('cmi.session_time', duration);
  }

  private secondsToIsoDuration(totalSeconds: number): string {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `PT${hours}H${minutes}M${seconds}S`;
  }
}

export const scorm = new Scorm2004Client();
