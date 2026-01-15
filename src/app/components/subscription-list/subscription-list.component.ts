import { Component, Input, Output, EventEmitter } from '@angular/core';
import { SubscriptionData } from 'app/services/subscription-data.service';

@Component({
  selector: 'app-subscription-list',
  template: `
    <mat-nav-list class="sub-nav-list">
      <mat-list-item *ngFor="let sub of subscriptions" style="pointer-events: none">
        <a style="pointer-events: auto;" class="a-list-item" matListItemTitle (click)="navigate.emit(sub)">
          <strong *ngIf="sub.name">{{sub.name}}&nbsp;<ng-container *ngIf="sub.paused" i18n="Paused suffix">(Paused)</ng-container></strong>
          <div *ngIf="!sub.name" i18n="Subscription playlist not available text">Name not available. Channel retrieval in progress.</div>
        </a>
        <div style="pointer-events: auto; color: unset" matListItemMeta>
          <button matTooltip="Edit" i18n-matTooltip="Edit" mat-icon-button (click)="edit.emit(sub)">
            <mat-icon>edit</mat-icon>
          </button>
          <button matTooltip="Info" i18n-matTooltip="Info" mat-icon-button (click)="info.emit(sub)">
            <mat-icon>info</mat-icon>
          </button>
        </div>
      </mat-list-item>
    </mat-nav-list>
    <div style="width: 80%; margin: 0 auto; padding-left: 15px;" *ngIf="subscriptions.length === 0 && subscriptions">
      <p>{{emptyText}}</p>
    </div>
  `
})
export class SubscriptionListComponent {
  @Input() subscriptions: SubscriptionData[];
  @Input() emptyText: string;
  @Output() navigate = new EventEmitter<SubscriptionData>();
  @Output() edit = new EventEmitter<SubscriptionData>();
  @Output() info = new EventEmitter<SubscriptionData>();
}
