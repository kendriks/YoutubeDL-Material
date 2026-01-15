import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-subscription-actions',
  template: `
    <div class="check-button">
      <ng-container *ngIf="isDownloading">
        <button color="primary" (click)="cancelCheck.emit()" [disabled]="cancelClicked" 
          matTooltip="Cancel subscription check" i18n-matTooltip="Cancel subscription check" mat-fab>
          <mat-icon class="save-icon">cancel</mat-icon>
        </button>
      </ng-container>
      <ng-container *ngIf="!isDownloading">
        <button color="primary" (click)="check.emit()" [disabled]="checkClicked" 
          matTooltip="Check subscription" i18n-matTooltip="Check subscription" mat-fab>
          <mat-icon class="save-icon">youtube_searched_for</mat-icon>
        </button>
      </ng-container>
    </div>
    <button class="watch-button" color="primary" (click)="watch.emit()" 
      matTooltip="Play all" i18n-matTooltip="Play all" mat-fab>
      <mat-icon class="save-icon">video_library</mat-icon>
    </button>
    <button class="save-button" color="primary" (click)="download.emit()" [disabled]="isDownloading" 
      matTooltip="Download zip" i18n-matTooltip="Download zip" mat-fab>
      <mat-icon class="save-icon">save</mat-icon>
      <mat-spinner *ngIf="isDownloading" class="spinner" [diameter]="50"></mat-spinner>
    </button>
  `
})
export class SubscriptionActionsComponent {
  @Input() isDownloading = false;
  @Input() checkClicked = false;
  @Input() cancelClicked = false;
  @Output() check = new EventEmitter<void>();
  @Output() cancelCheck = new EventEmitter<void>();
  @Output() watch = new EventEmitter<void>();
  @Output() download = new EventEmitter<void>();
}
