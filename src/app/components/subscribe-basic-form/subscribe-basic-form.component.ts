import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-subscribe-basic-form',
  template: `
    <mat-form-field color="accent">
      <mat-label i18n="URL">URL</mat-label>
      <input [(ngModel)]="url" matInput required aria-required="true">
      <mat-hint><ng-container i18n="Subscription URL input hint">The playlist or channel URL</ng-container></mat-hint>
    </mat-form-field>
    <mat-form-field color="accent">
      <mat-label i18n="Custom name">Custom name</mat-label>
      <input [(ngModel)]="name" matInput>
    </mat-form-field>
  `
})
export class SubscribeBasicFormComponent {
  @Input() url: string | null = null;
  @Input() name: string | null = null;
  @Output() urlChange = new EventEmitter<string>();
  @Output() nameChange = new EventEmitter<string>();
}
