import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EventEmitter } from '@angular/core';
import { ConfirmDialogComponent } from 'app/dialogs/confirm-dialog/confirm-dialog.component';
import { Clipboard } from '@angular/cdk/clipboard';
import { Download } from 'api-types';

@Injectable({
  providedIn: 'root'
})
export class DownloadDialogService {

  constructor(
    private dialog: MatDialog,
    private clipboard: Clipboard
  ) {}

  openClearDownloadsDialog(onClear: (finished: boolean, paused: boolean, errors: boolean) => void): void {
    const clearEmitter = new EventEmitter<boolean>();
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        dialogType: 'selection_list',
        dialogTitle: $localize`Clear downloads`,
        dialogText: $localize`Select downloads to clear`,
        submitText: $localize`Clear`,
        doneEmitter: clearEmitter,
        warnSubmitColor: true,
        list: [
          { title: $localize`Finished downloads`, key: 'clear_finished' },
          { title: $localize`Paused downloads`, key: 'clear_paused' },
          { title: $localize`Errored downloads`, key: 'clear_errors' }
        ]
      }
    });
    
    clearEmitter.subscribe((done: boolean) => {
      if (done) {
        const selectedItems = dialogRef.componentInstance.selected_items;
        onClear(
          selectedItems.includes('clear_finished'), 
          selectedItems.includes('clear_paused'), 
          selectedItems.includes('clear_errors')
        );
        dialogRef.close();
      }
    });
  }

  showError(download: Download, onCopy: () => void): void {
    const copyEmitter = new EventEmitter<boolean>();
    this.dialog.open(ConfirmDialogComponent, {
      data: {
        dialogTitle: $localize`Error for ${download['url']}:url:`,
        dialogText: download['error'],
        submitText: $localize`Copy to clipboard`,
        cancelText: $localize`Close`,
        closeOnSubmit: false,
        onlyEmitOnDone: true,
        doneEmitter: copyEmitter
      }
    });
    
    copyEmitter.subscribe(done => {
      if (done) {
        this.clipboard.copy(download['error']);
        onCopy();
      }
    });
  }
}