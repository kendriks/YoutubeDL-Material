import { Injectable } from '@angular/core';
import { PostsService } from 'app/posts.services';
import { DatabaseFile, FileType } from '../../../api-types';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class FileManagementService {

  constructor(public postsService: PostsService) { }

  downloadFile(file: DatabaseFile): void {
    const type = (file.isAudio ? 'audio' : 'video') as FileType;
    const ext = type === 'audio' ? '.mp3' : '.mp4';
    this.postsService.downloadFileFromServer(file.uid).subscribe((res: Blob) => {
      saveAs(res, decodeURIComponent(file.id) + ext);
      if (!this.postsService.config.Extra.file_manager_enabled && !file.sub_id) {
        this.postsService.deleteFile(file.uid).subscribe(() => {});
      }
    });
  }

  deleteNormalFile(file: DatabaseFile, blacklistMode = false): void {
    this.postsService.deleteFile(file.uid, blacklistMode).subscribe((result: boolean) => {
      if (result) {
        this.postsService.openSnackBar($localize`Delete success!`);
      } else {
        this.postsService.openSnackBar($localize`Delete failed!`);
      }
    }, () => this.postsService.openSnackBar($localize`Delete failed!`));
  }

  deleteSubscriptionFile(file: DatabaseFile, blacklistMode = false): void {
    if (blacklistMode) {
      this.deleteForever(file);
    } else {
      this.deleteAndRedownload(file);
    }
  }

  private deleteAndRedownload(file: DatabaseFile): void {
    this.postsService.deleteSubscriptionFile(file.uid, false).subscribe(() => {
      this.postsService.openSnackBar($localize`Successfully deleted file: ` + file.id);
    });
  }

  private deleteForever(file: DatabaseFile): void {
    this.postsService.deleteSubscriptionFile(file.uid, true).subscribe(() => {
      this.postsService.openSnackBar($localize`Successfully deleted file: ` + file.id);
    });
  }

  durationStringToNumber(dur_str: string): number {
    let num_sum = 0;
    const parts = dur_str.split(':');
    for (let i = parts.length - 1; i >= 0; i--) {
      num_sum += parseInt(parts[i]) * (60 ** (parts.length - 1 - i));
    }
    return num_sum;
  }
}
