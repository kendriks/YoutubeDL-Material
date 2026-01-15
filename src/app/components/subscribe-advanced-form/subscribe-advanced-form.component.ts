import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-subscribe-advanced-form',
  template: `
    <div class="col-12 mt-2">
      <mat-form-field>
        <mat-label i18n="Max quality">Max quality</mat-label>
        <mat-select [disabled]="audioOnlyMode" [(ngModel)]="maxQuality">
          <mat-option *ngFor="let quality of availableQualities" [value]="quality.value">
            {{quality.label}}
          </mat-option>
        </mat-select>
      </mat-form-field>
    </div>
    <div class="col-12">
      <mat-checkbox [(ngModel)]="audioOnlyMode">
        <ng-container i18n="Streaming-only mode">Audio-only mode</ng-container>
      </mat-checkbox>
    </div>
    <div class="col-12 mb-4">
      <mat-form-field color="accent">
        <mat-label i18n="Custom args">Custom args</mat-label>
        <input [(ngModel)]="customArgs" matInput>
        <button class="args-edit-button" (click)="openArgsEditor.emit()" mat-icon-button>
          <mat-icon>edit</mat-icon>
        </button>
        <mat-hint><ng-container i18n="Custom args hint">These are added after the standard args.</ng-container></mat-hint>
      </mat-form-field>
    </div>
    <div class="col-12">
      <mat-form-field color="accent">
        <mat-label i18n="Custom file output">Custom file output</mat-label>
        <input [(ngModel)]="customFileOutput" matInput>
        <mat-hint>
          <a target="_blank" href="https://github.com/ytdl-org/youtube-dl/blob/master/README.md#output-template">
            <ng-container i18n="Custom output template documentation link">Documentation</ng-container>
          </a>.
          <ng-container i18n="Custom Output input hint">Path is relative to the config download path. Don't include extension.</ng-container>
        </mat-hint>
      </mat-form-field>
    </div>
  `
})
export class SubscribeAdvancedFormComponent {
  @Input() maxQuality = 'best';
  @Input() audioOnlyMode = false;
  @Input() customArgs = '';
  @Input() customFileOutput = '';
  @Input() availableQualities: any[] = [];
  @Output() openArgsEditor = new EventEmitter<void>();
}
