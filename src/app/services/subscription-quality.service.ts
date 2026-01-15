import { Injectable } from '@angular/core';

export interface QualityOption {
  label: string;
  value: string;
}

@Injectable({
  providedIn: 'root'
})
export class SubscriptionQualityService {

  getAvailableQualities(): QualityOption[] {
    return [
      { label: 'Best', value: 'best' },
      { label: '4K', value: '2160' },
      { label: '1440p', value: '1440' },
      { label: '1080p', value: '1080' },
      { label: '720p', value: '720' },
      { label: '480p', value: '480' },
      { label: '360p', value: '360' }
    ];
  }

  getTimeUnits(): string[] {
    return ['day', 'week', 'month', 'year'];
  }
}
