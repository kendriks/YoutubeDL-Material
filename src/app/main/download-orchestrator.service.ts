import { Injectable } from '@angular/core';
import { PostsService } from '../posts.services';
import { DownloadStateManager } from './download-state.manager';
import { QualityManager } from './quality.manager';
import { SettingsManager } from './settings.manager';
import { AppConfigManager } from './app-config.manager';
import { UrlValidatorHelper } from './url-validator.helper';
import { FileType, Download, CropFileSettings } from 'api-types';
import { VideoFormat, AudioFormat } from './format-parser.helper';

type SelectedQuality = string | VideoFormat | AudioFormat | null;

@Injectable({
  providedIn: 'root'
})
export class DownloadOrchestrator {
  downloadingFile = false;

  constructor(
    private postsService: PostsService,
    private downloadState: DownloadStateManager,
    private qualityManager: QualityManager,
    private settings: SettingsManager,
    private configManager: AppConfigManager,
    private urlValidator: UrlValidatorHelper
  ) {}

  initiateDownload(url: string, youtubePassword: string | null, onError: () => void, onSuccess?: () => void): void {
    this.downloadingFile = true;

    const customArgs = this.getCustomArgs();
    const additionalArgs = this.getAdditionalArgs();
    const customOutput = this.getCustomOutput();
    const youtubeUsername = this.getYoutubeUsername();
    const youtubePass = this.getYoutubePassword(youtubePassword);

    if (this.settings.allowAdvancedDownload) {
      this.configManager.saveAdvancedSettings({
        customArgs,
        customOutput,
        youtubeUsername
      });
    }

    const type = this.settings.audioOnly ? 'audio' : 'video';
    const customQualityConfiguration = this.getQualityConfiguration(url, type);
    const cropFileSettings = this.settings.getCropFileSettings();
    const selected_quality = this.qualityManager.selectedQuality;
    
    this.qualityManager.clearSelection();

    const urls = this.urlValidator.parseURLArray(url);
    this.executeDownloads(urls, type as FileType, customQualityConfiguration, selected_quality, 
                         customArgs, additionalArgs, customOutput, youtubeUsername, 
                         youtubePass, cropFileSettings, onError, onSuccess);
  }

  generateSimulatedOutput(url: string, youtubePassword: string | null): void {
    if (this.urlValidator.isMultipleURLs(url)) return;

    const customArgs = this.getCustomArgs();
    const additionalArgs = this.getAdditionalArgs();
    const customOutput = this.getCustomOutput();
    const youtubeUsername = this.getYoutubeUsername();
    const youtubePass = this.getYoutubePassword(youtubePassword);

    const type = this.settings.audioOnly ? 'audio' : 'video';
    const customQualityConfiguration = this.getQualityConfiguration(url, type);
    const cropFileSettings = this.settings.getCropFileSettings();

    return this.postsService.generateArgs(
      url, 
      type as FileType,
      customQualityConfiguration || this.qualityManager.selectedQuality === '' || typeof this.qualityManager.selectedQuality !== 'string' ? null : this.qualityManager.selectedQuality,
      customQualityConfiguration, 
      customArgs, 
      additionalArgs, 
      customOutput, 
      youtubeUsername, 
      youtubePass, 
      cropFileSettings
    );
  }

  cancelDownload(download_to_cancel: Download | null = null): void {
    if (download_to_cancel) {
      this.downloadState.removeDownload(download_to_cancel);
      return;
    }
    this.downloadingFile = false;
    this.downloadState.clearCurrentDownload();
  }

  private executeDownloads(
    urls: string[], 
    type: FileType, 
    customQualityConfiguration: string | null,
    selected_quality: SelectedQuality,
    customArgs: string | null,
    additionalArgs: string | null,
    customOutput: string | null,
    youtubeUsername: string | null,
    youtubePassword: string | null,
    cropFileSettings: CropFileSettings | null,
    onError: () => void,
    onSuccess?: () => void
  ): void {
    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];
      this.postsService.downloadFile(
        url, 
        type, 
        customQualityConfiguration || selected_quality === '' || typeof selected_quality !== 'string' ? null : selected_quality,
        customQualityConfiguration, 
        customArgs, 
        additionalArgs, 
        customOutput, 
        youtubeUsername, 
        youtubePassword, 
        cropFileSettings
      ).subscribe(
        res => {
          this.downloadState.addDownload(res['download']);
          if (onSuccess && !this.settings.autoplay && urls.length === 1) {
            onSuccess();
          }
        },
        () => {
          this.downloadingFile = false;
          this.downloadState.clearCurrentDownload();
          onError();
        }
      );
    }
  }

  private getCustomArgs(): string | null {
    return this.settings.customArgsEnabled && this.settings.replaceArgs 
      ? this.settings.customArgs 
      : null;
  }

  private getAdditionalArgs(): string | null {
    return this.settings.customArgsEnabled && !this.settings.replaceArgs 
      ? this.settings.customArgs 
      : null;
  }

  private getCustomOutput(): string | null {
    return this.settings.customOutputEnabled 
      ? this.settings.customOutput 
      : null;
  }

  private getYoutubeUsername(): string | null {
    return this.settings.youtubeAuthEnabled && this.settings.youtubeUsername 
      ? this.settings.youtubeUsername 
      : null;
  }

  private getYoutubePassword(password: string | null): string | null {
    return this.settings.youtubeAuthEnabled && password 
      ? password 
      : null;
  }

  private getQualityConfiguration(url: string, type: string): string | null {
    return type === 'audio' 
      ? this.qualityManager.getSelectedAudioFormat(url)
      : this.qualityManager.getSelectedVideoFormat(url);
  }
}