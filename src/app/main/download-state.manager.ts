import { Injectable } from '@angular/core';
import { Download } from 'api-types';

@Injectable({
  providedIn: 'root'
})
export class DownloadStateManager {
  readonly downloads: Download[] = [];
  readonly download_uids: string[] = [];
  private current_download: Download = null;

  addDownload(download: Download): void {
    this.downloads.push(download);
    this.download_uids.push(download.uid);
    this.current_download = download;
  }

  getCurrentDownload(): Download | null {
    return this.current_download;
  }

  setCurrentDownload(download: Download | null): void {
    this.current_download = download;
  }

  getDownloadByUID(uid: string): Download {
    const index = this.downloads.findIndex(download => download.uid === uid);
    return index !== -1 ? this.downloads[index] : null;
  }

  removeDownload(download_to_remove: Download): boolean {
    if (this.current_download === download_to_remove) {
      this.current_download = null;
    }
    const index = this.downloads.indexOf(download_to_remove);
    if (index !== -1) {
      this.downloads.splice(index, 1);
      return true;
    }
    return false;
  }

  clearCurrentDownload(): void {
    this.current_download = null;
  }

  hasActiveDownload(): boolean {
    return this.current_download !== null;
  }
}