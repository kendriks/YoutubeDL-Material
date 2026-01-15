import { Injectable } from '@angular/core';
import { UrlValidatorHelper } from './url-validator.helper';
import { QualityManager } from './quality.manager';
import { SettingsManager } from './settings.manager';
import { TimeService } from 'app/core/time.service';

@Injectable({
  providedIn: 'root'
})
export class UrlValidationService {
  private readonly YOUTUBE_REGEX = /(?:http(?:s)?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:(?:watch)?\?(?:.*&)?v(?:i)?=|(?:embed|v|vi|user)\/))([^\?&\"'<> #]+)/;
  
  lastValidUrl = '';
  lastUrlCheck = 0;

  constructor(
    private urlValidator: UrlValidatorHelper,
    private qualityManager: QualityManager,
    private settings: SettingsManager,
    private timeService: TimeService
  ) {}

  validateAndProcess(url: string, onArgsChanged: () => void): boolean {
    if (this.urlValidator.isMultipleURLs(url)) {
      this.settings.autoplay = false;
      return true;
    }

    const valid = this.urlValidator.validateURL(url);
    if (!valid) return false;

    const ytValid = this.isYouTubeValid(url);
    
    if (valid && ytValid && this.shouldCheckUrl()) {
      if (url !== this.lastValidUrl && this.settings.allowQualitySelect) {
        this.qualityManager.getURLInfo(url);
        onArgsChanged();
      }
      this.lastValidUrl = url;
      this.lastUrlCheck = this.timeService.now();
    }

    return valid;
  }

  private isYouTubeValid(url: string): boolean {
    const reYT = new RegExp(this.YOUTUBE_REGEX);
    return true || reYT.test(url);
  }

  private shouldCheckUrl(): boolean {
    return this.timeService.now() - this.lastUrlCheck > 1000;
  }
}
