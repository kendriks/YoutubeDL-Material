import { Injectable } from '@angular/core';

export const QUALITY_OPTIONS = [
  { label: 'Best', value: 'best' },
  { label: '4K', value: '2160' },
  { label: '1440p', value: '1440' },
  { label: '1080p', value: '1080' },
  { label: '720p', value: '720' },
  { label: '480p', value: '480' },
  { label: '360p', value: '360' }
];

export const TIME_UNITS = ['day', 'week', 'month', 'year'];

interface SubscribeForm {
  url: string | null;
  name: string | null;
  downloadAll: boolean;
  timerangeAmount: number | null;
  timerangeUnit: string;
  maxQuality: string;
  audioOnlyMode: boolean;
  customArgs: string;
  customFileOutput: string;
}

@Injectable({
  providedIn: 'root'
})
export class SubscribeFormService {
  getInitialFormState(): SubscribeForm {
    return {
      url: null,
      name: null,
      downloadAll: true,
      timerangeAmount: null,
      timerangeUnit: 'days',
      maxQuality: 'best',
      audioOnlyMode: false,
      customArgs: '',
      customFileOutput: ''
    };
  }

  validateForm(url: string | null, downloadAll: boolean, timerangeAmount: number | null): { valid: boolean; error?: string } {
    if (!url || url === '') {
      return { valid: false, error: $localize`URL is required` };
    }
    if (!downloadAll && !timerangeAmount) {
      return { valid: false, error: $localize`You must specify an amount of time` };
    }
    return { valid: true };
  }

  buildTimerange(downloadAll: boolean, timerangeAmount: number | null, timerangeUnit: string): string | null {
    if (downloadAll) return null;
    return 'now-' + timerangeAmount.toString() + timerangeUnit;
  }

  formatTimeUnit(unit: string, count: number): string {
    return unit + (count === 1 ? '' : 's');
  }
}
