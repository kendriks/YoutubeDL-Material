import { Injectable } from '@angular/core';

export interface RawFormat {
  format_id: string;
  ext: string;
  vcodec: string;
  acodec?: string;
  abr?: number;
  height?: number;
  fps?: number;
  filesize?: number;
  filesize_approx?: number;
}

interface FormatObject {
  type: 'audio' | 'video' | null;
  key?: string;
  bitrate?: number;
  format_id?: string;
  ext?: string;
  label?: string;
  expected_filesize?: number | null;
  height?: number;
  acodec?: string;
  fps?: number;
}

interface FormatCollections {
  audio: Record<string, FormatObject>;
  video: Record<string, FormatObject>;
}

export interface ParsedFormats {
  best_audio_format?: string;
  video?: VideoFormat[];
  audio?: AudioFormat[];
}

export interface VideoFormat {
  key: string;
  height: number;
  fps: number;
  acodec?: string;
  format_id: string;
  label: string;
  expected_filesize?: number;
}

export interface AudioFormat {
  key: string;
  bitrate: number;
  format_id: string;
  ext: string;
  label: string;
  expected_filesize?: number;
}

@Injectable({
  providedIn: 'root'
})
export class FormatParserHelper {

  parseFormats(formats: RawFormat[]): ParsedFormats {
    const audio_formats: Record<string, FormatObject> = {};
    const video_formats: Record<string, FormatObject> = {};

    for (let i = 0; i < formats.length; i++) {
      const format_obj = { type: null };
      const format = formats[i];
      const format_type = (format.vcodec === 'none') ? 'audio' : 'video';

      format_obj.type = format_type;
      
      if (format_obj.type === 'audio' && format.abr) {
        this.processAudioFormat(format, format_obj, audio_formats);
      } else if (format_obj.type === 'video') {
        this.processVideoFormat(format, format_obj, video_formats);
      }
    }

    return this.buildParsedFormats(audio_formats, video_formats);
  }

  private processAudioFormat(format: RawFormat, format_obj: FormatObject, audio_formats: Record<string, FormatObject>): void {
    const key = format.abr!.toString() + 'K';
    format_obj['key'] = key;
    format_obj['bitrate'] = format.abr;
    format_obj['format_id'] = format.format_id;
    format_obj['ext'] = format.ext;
    format_obj['label'] = key;
    format_obj['expected_filesize'] = format.filesize ? format.filesize : (format.filesize_approx || null);

    if (audio_formats[key]) {
      if (format.ext === 'm4a') {
        audio_formats[key] = format_obj;
      }
    } else {
      audio_formats[key] = format_obj;
    }
  }

  private processVideoFormat(format: RawFormat, format_obj: FormatObject, video_formats: Record<string, FormatObject>): void {
    const key = `${format.height}p${Math.round(format.fps!)}`;
    if (format.ext === 'mp4' || format.ext === 'mkv' || format.ext === 'webm') {
      format_obj['key'] = key;
      format_obj['height'] = format.height;
      format_obj['acodec'] = format.acodec;
      format_obj['format_id'] = format.format_id;
      format_obj['label'] = key;
      format_obj['fps'] = Math.round(format.fps);
      format_obj['expected_filesize'] = format.filesize ? format.filesize : (format.filesize_approx || null);

      if (!(video_formats[key]) || format_obj['acodec'] !== 'none') {
        video_formats[key] = format_obj;
      }
    }
  }

  private buildParsedFormats(audio_formats: Record<string, FormatObject>, video_formats: Record<string, FormatObject>): ParsedFormats {
    const parsed_formats: Partial<ParsedFormats> = {};
    parsed_formats['best_audio_format'] = this.getBestAudioFormatForMp4(audio_formats);

    const best_audio = parsed_formats['best_audio_format'] 
      ? audio_formats[Object.keys(audio_formats).find(k => audio_formats[k].format_id === parsed_formats['best_audio_format'])!]
      : null;

    for (const video_format of Object.values(video_formats)) {
      if ((!video_format.acodec || video_format.acodec === 'none')
        && video_format.expected_filesize
        && best_audio?.expected_filesize) {
        video_format.expected_filesize += best_audio.expected_filesize;
      }
    }

    parsed_formats['video'] = Object.values(video_formats) as VideoFormat[];
    parsed_formats['audio'] = Object.values(audio_formats) as AudioFormat[];
    parsed_formats['video'] = parsed_formats['video'].sort((a, b) => b.height - a.height || b.fps - a.fps);
    parsed_formats['audio'] = parsed_formats['audio'].sort((a, b) => b.bitrate - a.bitrate);

    return parsed_formats;
  }

  getBestAudioFormatForMp4(audio_formats: Record<string, FormatObject>): string | null {
    let best_audio_format_for_mp4: string | null = null;
    let best_audio_format_bitrate = 0;
    const available_audio_format_keys = Object.keys(audio_formats);
    
    for (let i = 0; i < available_audio_format_keys.length; i++) {
      const audio_format_key = available_audio_format_keys[i];
      const audio_format = audio_formats[audio_format_key];
      const is_m4a = audio_format.ext === 'm4a';
      
      if (is_m4a && audio_format.bitrate! > best_audio_format_bitrate) {
        best_audio_format_for_mp4 = audio_format.format_id!;
        best_audio_format_bitrate = audio_format.bitrate!;
      }
    }
    
    return best_audio_format_for_mp4;
  }

  formatFileSize(bytes: number, si = true, dp = 1): string {
    const thresh = si ? 1000 : 1024;

    if (Math.abs(bytes) < thresh) {
      return bytes + ' B';
    }

    const units = si
      ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
      : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
    let u = -1;
    const r = 10 ** dp;

    do {
      bytes /= thresh;
      ++u;
    } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);

    return bytes.toFixed(dp) + ' ' + units[u];
  }
}
