import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppConfigManager {
  private readonly STORAGE_KEYS = {
    CUSTOM_ARGS_ENABLED: 'customArgsEnabled',
    CUSTOM_OUTPUT_ENABLED: 'customOutputEnabled',
    REPLACE_ARGS: 'replaceArgs',
    YOUTUBE_AUTH_ENABLED: 'youtubeAuthEnabled',
    CUSTOM_ARGS: 'customArgs',
    CUSTOM_OUTPUT: 'customOutput',
    YOUTUBE_USERNAME: 'youtubeUsername'
  } as const;

  loadFromLocalStorage<T>(key: string, defaultValue: T): T {
    const stored = localStorage.getItem(key);
    if (stored === null || stored === 'null') {
      return defaultValue;
    }
    if (typeof defaultValue === 'boolean') {
      return (stored === 'true') as unknown as T;
    }
    return stored as unknown as T;
  }

  saveToLocalStorage<T = string | boolean | number>(key: string, value: T): void {
    if (value !== null && value !== undefined) {
      localStorage.setItem(key, value.toString());
    }
  }

  getAdvancedSettings(): {
    customArgsEnabled: boolean;
    customOutputEnabled: boolean;
    replaceArgs: boolean;
    youtubeAuthEnabled: boolean;
    customArgs: string | null;
    customOutput: string | null;
    youtubeUsername: string | null;
  } {
    const keys = this.STORAGE_KEYS;
    return {
      customArgsEnabled: this.loadFromLocalStorage(keys.CUSTOM_ARGS_ENABLED, false),
      customOutputEnabled: this.loadFromLocalStorage(keys.CUSTOM_OUTPUT_ENABLED, false),
      replaceArgs: this.loadFromLocalStorage(keys.REPLACE_ARGS, false),
      youtubeAuthEnabled: this.loadFromLocalStorage(keys.YOUTUBE_AUTH_ENABLED, false),
      customArgs: this.loadFromLocalStorage(keys.CUSTOM_ARGS, null),
      customOutput: this.loadFromLocalStorage(keys.CUSTOM_OUTPUT, null),
      youtubeUsername: this.loadFromLocalStorage(keys.YOUTUBE_USERNAME, null)
    };
  }

  saveAdvancedSettings(settings: {
    customArgs?: string;
    customOutput?: string;
    youtubeUsername?: string;
  }): void {
    const keys = this.STORAGE_KEYS;
    if (settings.customArgs) {
      this.saveToLocalStorage(keys.CUSTOM_ARGS, settings.customArgs);
    }
    if (settings.customOutput) {
      this.saveToLocalStorage(keys.CUSTOM_OUTPUT, settings.customOutput);
    }
    if (settings.youtubeUsername) {
      this.saveToLocalStorage(keys.YOUTUBE_USERNAME, settings.youtubeUsername);
    }
  }
}