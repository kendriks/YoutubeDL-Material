import { Injectable } from '@angular/core';
import { PostsService } from '../posts.services';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../dialogs/confirm-dialog/confirm-dialog.component';
import { DBInfoResponse } from 'api-types';
import { EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DatabaseManagementService {
  private dbInfo: DBInfoResponse = null;
  private dbTransferring = false;
  private testingConnectionString = false;

  constructor(
    private postsService: PostsService,
    private dialog: MatDialog
  ) {}

  getDBInfo(): void {
    this.postsService.getDBInfo().subscribe(res => {
      this.dbInfo = res;
    });
  }

  getDbInfo(): DBInfoResponse {
    return this.dbInfo;
  }

  isDbTransferring(): boolean {
    return this.dbTransferring;
  }

  isTestingConnectionString(): boolean {
    return this.testingConnectionString;
  }

  transferDB(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        dialogTitle: 'Transfer DB',
        dialogText: `Are you sure you want to transfer the DB?`,
        submitText: 'Transfer',
      }
    });
    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.executeTransferDB();
      }
    });
  }

  private executeTransferDB(): void {
    this.dbTransferring = true;
    this.postsService.transferDB(this.dbInfo['using_local_db']).subscribe(res => {
      this.dbTransferring = false;
      const success = res['success'];
      if (success) {
        this.postsService.openSnackBar($localize`Successfully transfered DB! Reloading info...`);
        this.getDBInfo();
      } else {
        this.postsService.openSnackBar($localize`Failed to transfer DB -- transfer was aborted. Error: ` + res['error']);
      }
    }, err => {
      this.dbTransferring = false;
      this.postsService.openSnackBar($localize`Failed to transfer DB -- API call failed. See browser logs for details.`);
      console.error(err);
    });
  }

  testConnectionString(connectionString: string): void {
    this.testingConnectionString = true;
    this.postsService.testConnectionString(connectionString).subscribe(res => {
      this.testingConnectionString = false;
      if (res['success']) {
        this.postsService.openSnackBar($localize`Connection successful!`);
      } else {
        this.postsService.openSnackBar($localize`Connection failed! Error: ` + res['error']);
      }
    }, () => {
      this.testingConnectionString = false;
      this.postsService.openSnackBar($localize`Connection failed! Error: Server error. See logs for more info.`);
    });
  }
}
