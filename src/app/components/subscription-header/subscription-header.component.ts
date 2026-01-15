import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'api-types';

@Component({
  selector: 'app-subscription-header',
  template: `
    <div style="margin-bottom: 15px;">
      <h2 style="text-align: center;" *ngIf="subscription">
        {{subscription.name}}&nbsp;
        <ng-container *ngIf="subscription.paused" i18n="Paused suffix">(Paused)</ng-container>
        <button class="edit-button" (click)="edit.emit()" [disabled]="disabled" 
          matTooltip="Edit" i18n-matTooltip="Edit" mat-icon-button>
          <mat-icon class="save-icon">edit</mat-icon>
        </button>
      </h2>
      <mat-progress-bar *ngIf="subscription?.downloading" 
        style="width: 80%; margin: 0 auto; margin-top: 15px;" mode="indeterminate">
      </mat-progress-bar>
    </div>
    <mat-divider style="width: 80%; margin: 0 auto"></mat-divider>
  `
})
export class SubscriptionHeaderComponent {
  @Input() subscription: Subscription;
  @Input() disabled = false;
  @Output() edit = new EventEmitter<void>();
}
