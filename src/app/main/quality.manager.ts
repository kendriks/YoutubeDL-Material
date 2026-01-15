import { Injectable } from '@angular/core';
import { PostsService } from '../posts.services';
import { UrlValidatorHelper } from './url-validator.helper';
import { FormatParserHelper, ParsedFormats, RawFormat } from './format-parser.helper';

export interface AvailableFormat {
  formats?: ParsedFormats;
  formats_loading?: boolean;
  formats_failed?: boolean;
}

export interface QualityOption {
  resolution?: string;
  value: string;
  label: string;
  kbitrate?: string;
}

@Injectable({
  providedIn: 'root'
})
export class QualityManager {
  selectedQuality: string | any = null;
  selectedMaxQuality = '';
  cachedAvailableFormats: Record<string, AvailableFormat> = {};

  readonly qualityOptions = {
    video: [
      { resolution: '3840x2160', value: '2160', label: '2160p (4K)' },
      { resolution: '2560x1440', value: '1440', label: '1440p' },
      { resolution: '1920x1080', value: '1080', label: '1080p' },
      { resolution: '1280x720', value: '720', label: '720p' },
      { resolution: '720x480', value: '480', label: '480p' },
      { resolution: '480x360', value: '360', label: '360p' },
      { resolution: '360x240', value: '240', label: '240p' },
      { resolution: '256x144', value: '144', label: '144p' }
    ],
    audio: []
  };

  constructor(
    private postsService: PostsService,
    private urlValidator: UrlValidatorHelper,
    private formatParser: FormatParserHelper
  ) {}

  clearSelection(): void {
    this.selectedQuality = '';
  }

  getSelectedAudioFormat(url: string): string | null {
    if (typeof this.selectedQuality === 'string') {
      return null;
    }
    const cachedFormatsExists = this.cachedAvailableFormats[url]?.formats;
    return cachedFormatsExists ? this.selectedQuality['format_id'] : null;
  }

  getSelectedVideoFormat(url: string): string | null {
    if (typeof this.selectedQuality === 'string') {
      return null;
    }
    const cachedFormats = this.cachedAvailableFormats[url]?.formats;
    if (cachedFormats && this.selectedQuality) {
      let selected_video_format = this.selectedQuality['format_id'];
      const audio_missing = !this.selectedQuality['acodec'] || this.selectedQuality['acodec'] === 'none';
      if (audio_missing && cachedFormats['best_audio_format']) {
        selected_video_format += `+${cachedFormats['best_audio_format']}`;
      }
      return selected_video_format;
    }
    return null;
  }

  getURLInfo(url: string): void {
    if (!this.cachedAvailableFormats[url]) {
      this.cachedAvailableFormats[url] = {};
    }

    if (this.urlValidator.isPlaylistURL(url)) {
      this.cachedAvailableFormats[url].formats_loading = false;
      this.cachedAvailableFormats[url].formats_failed = true;
      return;
    }

    if (!(this.cachedAvailableFormats[url]?.formats)) {
      this.cachedAvailableFormats[url].formats_loading = true;
      this.postsService.getFileFormats(url).subscribe(
        res => {
          this.cachedAvailableFormats[url].formats_loading = false;
          const infos = res['result'];
          if (!infos || !infos.formats) {
            this.errorFormats(url);
            return;
          }
          this.cachedAvailableFormats[url].formats = this.parseFormats(infos.formats);
        },
        () => this.errorFormats(url)
      );
    }
  }

  private errorFormats(url: string): void {
    this.cachedAvailableFormats[url].formats_loading = false;
    this.cachedAvailableFormats[url].formats_failed = true;
    console.error('Could not load formats for url ' + url);
  }

  private parseFormats(formats: RawFormat[]): ParsedFormats {
    return this.formatParser.parseFormats(formats);
  }

  getBestAudioFormatForMp4(audio_formats: Record<string, AudioFormat>): string | null {
    return this.formatParser.getBestAudioFormatForMp4(audio_formats);
  }

  humanFileSize(bytes: number, si = true, dp = 1): string {
    return this.formatParser.formatFileSize(bytes, si, dp);
  }
}
