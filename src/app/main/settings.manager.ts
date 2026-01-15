import { Injectable } from '@angular/core';
import { PostsService } from '../posts.services';
import { CropFileSettings } from 'api-types';

@Injectable({
  providedIn: 'root'
})
export class SettingsManager {
  audioOnly = false;
  autoplay = false;
  customArgsEnabled = false;
  customArgs: string | null = null;
  customOutputEnabled = false;
  replaceArgs = false;
  customOutput: string | null = null;
  youtubeAuthEnabled = false;
  youtubeUsername: string | null = null;
  cropFile = false;
  cropFileStart: number | null = null;
  cropFileEnd: number | null = null;

  fileManagerEnabled = false;
  allowQualitySelect = false;
  downloadOnlyMode = false;
  forceAutoplay = false;
  globalCustomArgs: string | null = null;
  allowAdvancedDownload = false;
  useDefaultDownloadingAgent = true;
  customDownloadingAgent: string | null = null;
  youtubeSearchEnabled = false;
  youtubeAPIKey: string | null = null;

  constructor(private postsService: PostsService) {}

  loadFromLocalStorage(): void {
    if (localStorage.getItem('audioOnly') !== null) {
      this.audioOnly = localStorage.getItem('audioOnly') === 'true';
    }

    if (localStorage.getItem('autoplay') !== null && !this.forceAutoplay) {
      this.autoplay = localStorage.getItem('autoplay') === 'true';
    }

    if (localStorage.getItem('customArgsEnabled') !== null) {
      this.customArgsEnabled = localStorage.getItem('customArgsEnabled') === 'true';
    }

    if (localStorage.getItem('customOutputEnabled') !== null) {
      this.customOutputEnabled = localStorage.getItem('customOutputEnabled') === 'true';
    }

    if (localStorage.getItem('replaceArgs') !== null) {
      this.replaceArgs = localStorage.getItem('replaceArgs') === 'true';
    }

    if (localStorage.getItem('youtubeAuthEnabled') !== null) {
      this.youtubeAuthEnabled = localStorage.getItem('youtubeAuthEnabled') === 'true';
    }

    this.customArgs = localStorage.getItem('customArgs');
    this.customOutput = localStorage.getItem('customOutput');
    this.youtubeUsername = localStorage.getItem('youtubeUsername');
  }

  loadGlobalSettings(): void {
    const config = this.postsService.config;
    
    this.fileManagerEnabled = config['Extra']['file_manager_enabled'] 
                             && this.postsService.hasPermission('filemanager');
    this.downloadOnlyMode = config['Extra']['download_only_mode'];
    this.forceAutoplay = config['Extra']['force_autoplay'];
    this.globalCustomArgs = config['Downloader']['custom_args'];
    this.youtubeSearchEnabled = config['API']?.use_youtube_API && config['API']?.youtube_API_key;
    this.youtubeAPIKey = this.youtubeSearchEnabled ? config['API']['youtube_API_key'] : null;
    this.allowQualitySelect = config['Extra']['allow_quality_select'];
    this.allowAdvancedDownload = config['Advanced']['allow_advanced_download']
                                && this.postsService.hasPermission('advanced_download');
    this.useDefaultDownloadingAgent = config['Advanced']['use_default_downloading_agent'];
    this.customDownloadingAgent = config['Advanced']['custom_downloading_agent'];

    if (this.forceAutoplay) {
      this.autoplay = true;
    }
  }

  saveLocalSetting(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  getCropFileSettings(): CropFileSettings | null {
    if (!this.cropFile || this.cropFileStart === null || this.cropFileEnd === null) {
      return null;
    }
    return {
      cropFileStart: this.cropFileStart,
      cropFileEnd: this.cropFileEnd
    };
  }
}
