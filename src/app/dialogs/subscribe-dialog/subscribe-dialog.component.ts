import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { ArgModifierDialogComponent } from '../arg-modifier-dialog/arg-modifier-dialog.component';
import { SubscribeDataService } from 'app/services/subscribe-data.service';
import { SubscribeFormService, QUALITY_OPTIONS, TIME_UNITS } from 'app/services/subscribe-form.service';

@Component({
  selector: 'app-subscribe-dialog',
  templateUrl: './subscribe-dialog.component.html',
  styleUrls: ['./subscribe-dialog.component.scss']
})
export class SubscribeDialogComponent implements OnInit {
  url: string | null = null;
  name: string | null = null;
  downloadAll = true;
  timerangeAmount: number | null = null;
  timerangeUnit = 'days';
  maxQuality = 'best';
  audioOnlyMode = false;
  customArgs = '';
  customFileOutput = '';
  subscribing = false;

  availableQualities = QUALITY_OPTIONS;
  timeUnits = TIME_UNITS;

  constructor(
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<SubscribeDialogComponent>,
    private dataService: SubscribeDataService,
    private formService: SubscribeFormService
  ) { }

  ngOnInit(): void { }

  subscribeClicked(): void {
    const validation = this.formService.validateForm(this.url, this.downloadAll, this.timerangeAmount);
    if (!validation.valid) {
      this.dataService.notifyError(validation.error);
      return;
    }

    this.subscribing = true;
    const timerange = this.formService.buildTimerange(this.downloadAll, this.timerangeAmount, this.timerangeUnit);
    
    this.dataService.createSubscription({
      url: this.url,
      name: this.name,
      timerange,
      maxQuality: this.maxQuality,
      audioOnlyMode: this.audioOnlyMode,
      customArgs: this.customArgs,
      customFileOutput: this.customFileOutput
    }).subscribe(
      res => this.handleSubscribeResponse(res),
      () => this.handleSubscribeError()
    );
  }

  private handleSubscribeResponse(res: { new_sub?: any; error?: string }): void {
    this.subscribing = false;
    if (res.new_sub) {
      this.dialogRef.close(res.new_sub);
    } else {
      if (res.error) {
        this.dataService.notifyError($localize`ERROR: ` + res.error);
      }
      this.dialogRef.close();
    }
  }

  private handleSubscribeError(): void {
    this.subscribing = false;
    this.dataService.notifyError($localize`Failed to create subscription`);
  }

  openArgsModifierDialog(): void {
    const dialogRef = this.dialog.open(ArgModifierDialogComponent, {
      data: { initial_args: this.customArgs }
    });
    dialogRef.afterClosed().subscribe(newArgs => {
      if (newArgs !== null && newArgs !== undefined) {
        this.customArgs = newArgs;
      }
    });
  }
}
