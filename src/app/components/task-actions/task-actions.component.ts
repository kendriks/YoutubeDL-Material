import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Task } from 'api-types';

@Component({
  selector: 'app-task-actions',
  template: `
    <div class="container">
      <div class="row justify-content-start">
        <div *ngIf="task.data?.uids?.length > 0 || (!task.data?.uids && task.data)" class="col-12 mt-2" style="display: flex; justify-content: center;">
          <button (click)="onConfirm()" [disabled]="task.running || task.confirming" mat-stroked-button>
            <ng-container *ngIf="task.key == 'missing_files_check'">
              <ng-container i18n="Clear missing files from DB">Clear missing files from DB:</ng-container>{{task.data.uids.length}}
            </ng-container>
            <ng-container *ngIf="task.key == 'duplicate_files_check'">
              <ng-container i18n="Clear duplicate files from DB">Clear duplicate files from DB:</ng-container>&nbsp;{{task.data.uids.length}}
            </ng-container>
            <ng-container *ngIf="task.key == 'youtubedl_update_check'">
              <ng-container i18n="Update binary to">Update binary to:</ng-container>&nbsp;{{task.data}}
            </ng-container>
            <ng-container *ngIf="task.key == 'delete_old_files'">
              <ng-container i18n="Delete old files">Delete old files:</ng-container>&nbsp;{{task.data.files_to_remove.length}}
            </ng-container>
          </button>
        </div>
        <div class="col-3">
          <button (click)="onRun()" [disabled]="task.running || task.confirming" mat-icon-button matTooltip="Run" i18n-matTooltip="Run">
            <mat-icon>play_arrow</mat-icon>
          </button>
        </div>
        <div class="col-3">
          <button (click)="onSchedule()" mat-icon-button matTooltip="Schedule" i18n-matTooltip="Schedule">
            <mat-icon>schedule</mat-icon>
          </button>
        </div>
        <div class="col-3">
          <button (click)="onSettings()" mat-icon-button matTooltip="Settings" i18n-matTooltip="Settings">
            <mat-icon>settings</mat-icon>
          </button>
        </div>
        <div *ngIf="task.error" class="col-3">
          <button (click)="onShowError()" mat-icon-button matTooltip="Show error" i18n-matTooltip="Show error">
            <mat-icon>warning</mat-icon>
          </button>
        </div>
      </div>
    </div>
  `
})
export class TaskActionsComponent {
  @Input() task: Task;
  @Output() run = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<void>();
  @Output() schedule = new EventEmitter<void>();
  @Output() settings = new EventEmitter<void>();
  @Output() showError = new EventEmitter<void>();

  onRun(): void { this.run.emit(); }
  onConfirm(): void { this.confirm.emit(); }
  onSchedule(): void { this.schedule.emit(); }
  onSettings(): void { this.settings.emit(); }
  onShowError(): void { this.showError.emit(); }
}
