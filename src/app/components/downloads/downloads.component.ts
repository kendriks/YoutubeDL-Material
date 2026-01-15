import { Component, OnInit, OnDestroy, ViewChild, Input, HostListener } from '@angular/core';
import { PostsService } from 'app/posts.services';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Download } from 'api-types';
import { DownloadManagerService } from './download-manager.service';
import { DownloadNavigationService } from './download-navigation.service';
import { DownloadDialogService } from './download-dialog.service';
import { DownloadActionsConfig, DownloadAction } from './download-actions.config';
import { Router } from '@angular/router';

@Component({
  selector: 'app-downloads',
  templateUrl: './downloads.component.html',
  styleUrls: ['./downloads.component.scss']
})
export class DownloadsComponent implements OnInit, OnDestroy {
  @Input() uids: string[] = null;

  downloads: Download[] = [];
  intervalId: number | null = null;
  pausedDownloadExists = false;
  runningDownloadExists = false;
  downloadsRetrieved = false;
  innerWidth: number;
  actionsFlex = 2;
  minimizeButtons = false;
  
  readonly STEP_INDEX_TO_LABEL = DownloadActionsConfig.STEP_INDEX_TO_LABEL;
  readonly displayedColumnsBig: string[] = ['timestamp_start', 'title', 'sub_name', 'percent_complete', 'actions'];
  readonly displayedColumnsSmall: string[] = ['title', 'percent_complete', 'actions'];
  displayedColumns: string[] = this.displayedColumnsBig;
  dataSource: MatTableDataSource<Download> | null = null;
  downloadActions: DownloadAction[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  @HostListener('window:resize')
  onResize(): void {
    this.innerWidth = window.innerWidth;
    this.recalculateColumns();
  }

  constructor(
    public postsService: PostsService,
    private router: Router,
    private downloadManager: DownloadManagerService,
    private downloadNavigation: DownloadNavigationService,
    private downloadDialog: DownloadDialogService
  ) {
    this.downloadActions = DownloadActionsConfig.createActions(
      (d) => this.watchContent(d),
      (d) => this.showError(d),
      (d) => this.restartDownload(d),
      (d) => this.pauseDownload(d),
      (d) => this.resumeDownload(d),
      (d) => this.cancelDownload(d),
      (d) => this.clearDownload(d)
    );
  }

  ngOnInit(): void {
    if (this.uids) this.displayedColumnsBig.filter(col => col !== 'sub_name');
    this.innerWidth = window.innerWidth;
    this.recalculateColumns();
    
    if (this.postsService.initialized) {
      this.startDownloadsPolling();
    } else {
      this.postsService.service_initialized.subscribe(init => {
        if (init) this.startDownloadsPolling();
      });
    }
  }

  ngOnDestroy(): void {
    if (this.intervalId) clearInterval(this.intervalId);
  }

  startDownloadsPolling(): void {
    if (!this.postsService.config['Extra']['enable_downloads_manager']) {
      this.downloadNavigation.navigateToHome();
      return;
    }
    this.getCurrentDownloads();
    this.intervalId = window.setInterval(() => this.getCurrentDownloads(), 1000);
  }

  getCurrentDownloads(): void {
    this.downloadManager.getCurrentDownloads(this.uids).subscribe(res => {
      if (res['downloads'] && JSON.stringify(this.downloads) !== JSON.stringify(res['downloads'])) {
        this.downloads = this.downloadManager.combineDownloads(this.downloads, res['downloads']);
        this.downloads.sort(this.downloadManager.sortDownloads);
        this.dataSource = new MatTableDataSource<Download>(this.downloads);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.pausedDownloadExists = !!this.downloads.find(d => d.paused && !d.error);
        this.runningDownloadExists = !!this.downloads.find(d => !d.paused && !d.finished);
      }
      this.downloadsRetrieved = true;
    });
  }

  clearDownloadsByType(): void {
    this.downloadDialog.openClearDownloadsDialog((finished, paused, errors) => {
      this.downloadManager.clearDownloads(finished, paused, errors).subscribe(res => {
        const message = res['success'] ? $localize`Cleared downloads!` : $localize`Failed to clear finished downloads!`;
        this.postsService.openSnackBar(message);
      });
    });
  }

  pauseDownload(download: Download): void {
    this.downloadManager.pauseDownload(download.uid).subscribe(res => {
      if (!res['success']) this.postsService.openSnackBar($localize`Failed to pause download! See server logs for more info.`);
    });
  }

  pauseAllDownloads(): void {
    this.downloadManager.pauseAllDownloads().subscribe(res => {
      if (!res['success']) this.postsService.openSnackBar($localize`Failed to pause all downloads! See server logs for more info.`);
    });
  }

  resumeDownload(download: Download): void {
    this.downloadManager.resumeDownload(download.uid).subscribe(res => {
      if (!res['success']) this.postsService.openSnackBar($localize`Failed to resume download! See server logs for more info.`);
    });
  }

  resumeAllDownloads(): void {
    this.downloadManager.resumeAllDownloads().subscribe(res => {
      if (!res['success']) this.postsService.openSnackBar($localize`Failed to resume all downloads! See server logs for more info.`);
    });
  }

  restartDownload(download: Download): void {
    this.downloadManager.restartDownload(download.uid).subscribe(res => {
      if (!res['success']) {
        this.postsService.openSnackBar($localize`Failed to restart download! See server logs for more info.`);
      } else if (this.uids && res['new_download_uid']) {
        this.uids.push(res['new_download_uid']);
      }
    });
  }

  cancelDownload(download: Download): void {
    this.downloadManager.cancelDownload(download.uid).subscribe(res => {
      if (!res['success']) this.postsService.openSnackBar($localize`Failed to cancel download! See server logs for more info.`);
    });
  }

  clearDownload(download: Download): void {
    this.downloadManager.clearDownload(download.uid).subscribe(res => {
      if (!res['success']) this.postsService.openSnackBar($localize`Failed to pause download! See server logs for more info.`);
    });
  }

  watchContent(download: Download): void {
    this.downloadNavigation.watchContent(download, this.router.url);
  }

  showError(download: Download): void {
    this.downloadDialog.showError(download, () => {
      this.postsService.openSnackBar($localize`Copied to clipboard!`);
    });
  }

  recalculateColumns(): void {
    this.displayedColumns = this.innerWidth < 650 ? this.displayedColumnsSmall : this.displayedColumnsBig;
    this.actionsFlex = this.uids || this.innerWidth < 800 ? 1 : 2;
    this.minimizeButtons = (this.innerWidth < 800 && !this.uids) || (this.innerWidth < 1100 && !!this.uids);
  }
}