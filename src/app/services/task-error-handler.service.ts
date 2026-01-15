import { Injectable, EventEmitter } from '@angular/core';
import { Task } from 'api-types';
import { TaskDialogService } from './task-dialog.service';
import { ClipboardHandlerService } from './clipboard-handler.service';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class TaskErrorHandlerService {

  constructor(
    private taskDialogService: TaskDialogService,
    private clipboardHandlerService: ClipboardHandlerService,
    private notificationService: NotificationService
  ) { }

  handleErrorDisplay(task: Task): void {
    const copyEmitter = new EventEmitter<boolean>();
    const dialogRef = this.taskDialogService.openErrorDialog(task);
    dialogRef.componentInstance.doneEmitter = copyEmitter;
    
    this.setupClipboardCopy(task, copyEmitter);
  }

  private setupClipboardCopy(task: Task, emitter: EventEmitter<boolean>): void {
    this.clipboardHandlerService.copyErrorToClipboard(task, emitter);
    emitter.subscribe((done: boolean) => {
      if (done) {
        this.notificationService.showSuccessMessage($localize`Copied to clipboard!`);
      }
    });
  }
}
