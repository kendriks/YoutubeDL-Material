import { Injectable } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { PostsService } from '../posts.services';
import { SettingsManager } from './settings.manager';
import { AppConfigManager } from './app-config.manager';
import { DownloadStateManager } from './download-state.manager';
import { DatabaseFile, Playlist, Download } from 'api-types';

interface DownloadResponse {
  download?: Download & {
    container?: DatabaseFile | Playlist;
    file_uids?: string[];
  };
}

@Injectable({
  providedIn: 'root'
})
export class ComponentLifecycleService {
  private downloadIntervalSub: Subscription | null = null;

  constructor(
    private postsService: PostsService,
    private settings: SettingsManager,
    private configManager: AppConfigManager,
    private downloadState: DownloadStateManager
  ) {}

  async loadConfiguration(
    onCacheUpdate: (enabled: boolean) => void,
    onSimulatedOutput: () => void,
    onDownloadCheck: () => void
  ): Promise<boolean> {
    this.settings.loadGlobalSettings();

    const fileManagerEnabled = this.settings.fileManagerEnabled;
    localStorage.setItem('cached_filemanager_enabled', fileManagerEnabled.toString());
    onCacheUpdate(fileManagerEnabled);

    if (this.settings.allowAdvancedDownload) {
      const advSettings = this.configManager.getAdvancedSettings();
      this.settings.customArgsEnabled = advSettings.customArgsEnabled;
      this.settings.customOutputEnabled = advSettings.customOutputEnabled;
      this.settings.replaceArgs = advSettings.replaceArgs;
      this.settings.youtubeAuthEnabled = advSettings.youtubeAuthEnabled;
      this.settings.customArgs = advSettings.customArgs;
      this.settings.customOutput = advSettings.customOutput;
      this.settings.youtubeUsername = advSettings.youtubeUsername;

      onSimulatedOutput();
    }

    this.startDownloadPolling(onDownloadCheck);

    return true;
  }

  startDownloadPolling(onDownloadCheck: () => void): void {
    if (this.downloadIntervalSub) {
      this.downloadIntervalSub.unsubscribe();
    }

    this.downloadIntervalSub = interval(1000).subscribe(() => {
      if (this.downloadState.hasActiveDownload()) {
        onDownloadCheck();
      }
    });
  }

  stopDownloadPolling(): void {
    if (this.downloadIntervalSub) {
      this.downloadIntervalSub.unsubscribe();
      this.downloadIntervalSub = null;
    }
  }

  handleDownloadComplete(
    downloadResponse: DownloadResponse,
    onComplete: (container: DatabaseFile | Playlist, type: string, is_playlist: boolean) => void
  ): void {
    if (downloadResponse.download) {
      this.downloadState.setCurrentDownload(downloadResponse.download);

      const download = downloadResponse.download;
      if (download.finished && !download.error) {
        const container = download.container;
        const is_playlist = download.file_uids.length > 1;
        const type = download.type;
        this.downloadState.clearCurrentDownload();
        onComplete(container, type, is_playlist);
      } else if (download.finished && download.error) {
        this.postsService.openSnackBar($localize`Download failed!`, 'OK.');
        this.downloadState.clearCurrentDownload();
      }
    }
  }
}