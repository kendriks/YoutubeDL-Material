import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'app/services/subscription-management.service';
import { QualityOption } from 'app/services/subscription-quality.service';

@Component({
  selector: 'app-subscription-settings',
  template: `
    <div class="col-12 mt-3">
      <mat-checkbox [(ngModel)]="sub.paused" i18n="Paused subscription setting">Paused</mat-checkbox>
    </div>
    <div class="col-12 mt-3">
      <mat-checkbox (change)="onDownloadAllToggle()" [(ngModel)]="downloadAll" i18n="Download all uploads subscription setting">
        Download all uploads
      </mat-checkbox>
    </div>
    <app-subscription-timerange 
      [amount]="timerangeAmount"
      [unit]="timerangeUnit"
      [timeUnits]="timeUnits"
      [downloadAll]="downloadAll"
      [editor_initialized]="editor_initialized"
      (changed)="onTimerangeChange($event)">
    </app-subscription-timerange>
    <div class="col-12">
      <mat-checkbox [disabled]="true" [(ngModel)]="audioOnlyMode" i18n="Streaming-only mode">Audio-only mode</mat-checkbox>
    </div>
    <div class="col-12 mt-2">
      <mat-form-field>
        <mat-label i18n="Max quality">Max quality</mat-label>
        <mat-select [disabled]="sub.type === 'audio'" [(ngModel)]="sub.maxQuality">
          <mat-option *ngFor="let q of qualities" [value]="q.value">{{q.label}}</mat-option>
        </mat-select>
      </mat-form-field>
    </div>
    <div class="col-12 mb-3">
      <mat-form-field color="accent">
        <mat-label i18n="Custom args">Custom args</mat-label>
        <input [(ngModel)]="sub.custom_args" matInput>
        <button class="args-edit-button" (click)="onEditArgs()" mat-icon-button><mat-icon>edit</mat-icon></button>
        <mat-hint i18n="Custom args hint">These are added after the standard args.</mat-hint>
      </mat-form-field>
    </div>
    <div class="col-12 mt-2">
      <mat-form-field color="accent">
        <mat-label i18n="Custom file output">Custom file output</mat-label>
        <input [(ngModel)]="sub.custom_output" matInput>
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
export class SubscriptionSettingsComponent {
  @Input() sub: Subscription;
  @Input() downloadAll: boolean;
  @Input() audioOnlyMode: boolean;
  @Input() timerangeAmount: number;
  @Input() timerangeUnit: string;
  @Input() timeUnits: string[];
  @Input() qualities: QualityOption[];
  @Input() editor_initialized: boolean;
  
  @Output() downloadAllToggled = new EventEmitter<void>();
  @Output() timerangeChanged = new EventEmitter<{amount: number, unit: string}>();
  @Output() editArgs = new EventEmitter<void>();

  onDownloadAllToggle(): void { this.downloadAllToggled.emit(); }
  onTimerangeChange(value: {amount: number, unit: string}): void { this.timerangeChanged.emit(value); }
  onEditArgs(): void { this.editArgs.emit(); }
}
