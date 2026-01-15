import { Injectable } from '@angular/core';
import { PostsService } from '../posts.services';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../dialogs/confirm-dialog/confirm-dialog.component';
import { ArgModifierDialogComponent } from '../dialogs/arg-modifier-dialog/arg-modifier-dialog.component';
import { CookiesUploaderDialogComponent } from '../dialogs/cookies-uploader-dialog/cookies-uploader-dialog.component';
import { GenerateRssUrlComponent } from '../dialogs/generate-rss-url/generate-rss-url.component';
import { EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DownloaderManagementService {
  constructor(
    private postsService: PostsService,
    private dialog: MatDialog
  ) {}

  generateAPIKey(): void {
    this.postsService.generateNewAPIKey().subscribe(res => {
      if (res['new_api_key']) {
        const initialConfig = this.postsService.config;
        const newConfig = JSON.parse(JSON.stringify(initialConfig));
        initialConfig.API.API_key = res['new_api_key'];
        newConfig.API.API_key = res['new_api_key'];
      }
    });
  }

  openArgsModifierDialog(currentArgs: string): void {
    const dialogRef = this.dialog.open(ArgModifierDialogComponent, {
      data: {
        initial_args: currentArgs
      }
    });
    dialogRef.afterClosed().subscribe(newArgs => {
      if (newArgs !== null && newArgs !== undefined) {
        const newConfig = this.postsService.config;
        newConfig['Downloader']['custom_args'] = newArgs;
      }
    });
  }

  openCookiesUploaderDialog(): void {
    this.dialog.open(CookiesUploaderDialogComponent, {
      width: '65vw'
    });
  }

  killAllDownloads(): void {
    const done = new EventEmitter<boolean>();
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        dialogTitle: 'Kill downloads',
        dialogText: 'Are you sure you want to kill all downloads? Any subscription and non-subscription downloads will end immediately, though this operation may take a minute or so to complete.',
        submitText: 'Kill all downloads',
        doneEmitter: done,
        warnSubmitColor: true
      }
    });
    done.subscribe(confirmed => {
      if (confirmed) {
        this.postsService.killAllDownloads().subscribe(res => {
          if (res['success']) {
            dialogRef.close();
            this.postsService.openSnackBar($localize`Successfully killed all downloads!`);
          } else {
            dialogRef.close();
            this.postsService.openSnackBar($localize`Failed to kill all downloads! Check logs for details.`);
          }
        }, () => {
          dialogRef.close();
          this.postsService.openSnackBar($localize`Failed to kill all downloads! Check logs for details.`);
        });
      }
    });
  }

  openGenerateRSSURLDialog(): void {
    this.dialog.open(GenerateRssUrlComponent, {
      width: '80vw',
      maxWidth: '880px'
    });
  }
}
