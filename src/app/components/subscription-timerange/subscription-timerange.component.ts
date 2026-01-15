import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-subscription-timerange',
  template: `
    <div class="col-12" *ngIf="editor_initialized">
      <ng-container i18n="Download time range prefix">Download videos uploaded in the last</ng-container>
      <mat-form-field color="accent" class="amount-select">
        <input type="number" matInput [(ngModel)]="amount" (ngModelChange)="onAmountChange($event)" [disabled]="downloadAll">
      </mat-form-field>
      <mat-form-field class="unit-select">
        <mat-select color="accent" [(ngModel)]="unit" (ngModelChange)="onUnitChange($event)" [disabled]="downloadAll">
          <mat-option *ngFor="let time_unit of timeUnits" [value]="time_unit + (amount === 1 ? '' : 's')">
            {{time_unit + (amount === 1 ? '' : 's')}}
          </mat-option>
        </mat-select>
      </mat-form-field>
    </div>
  `
})
export class SubscriptionTimerangeComponent {
  @Input() amount: number;
  @Input() unit: string;
  @Input() timeUnits: string[];
  @Input() downloadAll: boolean;
  @Input() editor_initialized: boolean;
  @Output() changed = new EventEmitter<{amount: number, unit: string}>();

  onAmountChange(value: number): void {
    this.changed.emit({amount: value, unit: this.unit});
  }

  onUnitChange(value: string): void {
    this.changed.emit({amount: this.amount, unit: value});
  }
}
