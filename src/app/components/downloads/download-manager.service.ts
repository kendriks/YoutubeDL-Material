import { Injectable } from '@angular/core';
import { PostsService } from 'app/posts.services';
import { Download } from 'api-types';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DownloadManagerService {

  constructor(private postsService: PostsService) {}

  pauseDownload(uid: string): Observable<{ success: boolean }> {
    return this.postsService.pauseDownload(uid);
  }

  pauseAllDownloads(): Observable<{ success: boolean }> {
    return this.postsService.pauseAllDownloads();
  }

  resumeDownload(uid: string): Observable<{ success: boolean }> {
    return this.postsService.resumeDownload(uid);
  }

  resumeAllDownloads(): Observable<{ success: boolean }> {
    return this.postsService.resumeAllDownloads();
  }

  restartDownload(uid: string): Observable<{ success: boolean; new_download_uid?: string }> {
    return this.postsService.restartDownload(uid);
  }

  cancelDownload(uid: string): Observable<{ success: boolean }> {
    return this.postsService.cancelDownload(uid);
  }

  clearDownload(uid: string): Observable<{ success: boolean }> {
    return this.postsService.clearDownload(uid);
  }

  clearDownloads(finished: boolean, paused: boolean, errors: boolean): Observable<{ success: boolean }> {
    return this.postsService.clearDownloads(finished, paused, errors);
  }

  getCurrentDownloads(uids: string[] | null): Observable<{ downloads: Download[] }> {
    return this.postsService.getCurrentDownloads(uids);
  }

  combineDownloads(downloadsOld: Download[], downloadsNew: Download[]): Download[] {
    downloadsOld = downloadsOld.filter(downloadOld => 
      downloadsNew.some(downloadNew => downloadNew.uid === downloadOld.uid)
    );

    const downloadsToAdd = downloadsNew.filter(downloadNew => 
      !downloadsOld.some(downloadOld => downloadNew.uid === downloadOld.uid)
    );
    downloadsOld.push(...downloadsToAdd);
    
    downloadsOld.forEach(downloadOld => {
      const downloadNew = downloadsNew.find(d => downloadOld.uid === d.uid);
      Object.keys(downloadNew).forEach(key => {
        downloadOld[key] = downloadNew[key];
      });
      Object.keys(downloadOld).forEach(key => {
        if (!downloadNew[key]) delete downloadOld[key];
      });
    });

    return downloadsOld;
  }

  sortDownloads(a: Download, b: Download): number {
    return b.timestamp_start - a.timestamp_start;
  }
}