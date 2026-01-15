import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SubscriptionQualityService, QualityOption } from 'app/services/subscription-quality.service';
import { SubscriptionManagementService, Subscription, TimerangeInfo } from 'app/services/subscription-management.service';
import { SubscriptionDialogService } from 'app/services/subscription-dialog.service';

export interface DialogData {
  sub: Subscription;
}

@Component({
  selector: 'app-edit-subscription-dialog',
  templateUrl: './edit-subscription-dialog.component.html',
  styleUrls: ['./edit-subscription-dialog.component.scss']
})
export class EditSubscriptionDialogComponent implements OnInit {
  updating = false;
  editor_initialized = false;

  sub: Subscription;
  new_sub: Subscription;

  timerange_amount: number;
  timerange_unit: string;
  audioOnlyMode: boolean;
  download_all: boolean;

  available_qualities: QualityOption[];
  time_units: string[];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private qualityService: SubscriptionQualityService,
    private subManagementService: SubscriptionManagementService,
    private subDialogService: SubscriptionDialogService
  ) {
    this.available_qualities = this.qualityService.getAvailableQualities();
    this.time_units = this.qualityService.getTimeUnits();
    
    this.initializeSubscription();
  }

  ngOnInit(): void { }

  private initializeSubscription(): void {
    this.sub = this.subManagementService.cloneSubscription(this.data.sub);
    this.new_sub = this.subManagementService.cloneSubscription(this.sub);

    this.subManagementService.removeVideosField(this.sub);
    this.subManagementService.removeVideosField(this.new_sub);

    this.audioOnlyMode = this.subManagementService.isAudioMode(this.sub);
    this.download_all = this.subManagementService.shouldDownloadAll(this.sub);

    if (this.sub.timerange) {
      const timerangeInfo = this.subManagementService.parseTimerange(this.sub.timerange);
      this.timerange_amount = timerangeInfo.amount;
      this.timerange_unit = timerangeInfo.unit;
    }
    
    this.editor_initialized = true;
  }

  downloadAllToggled(): void {
    if (this.download_all) {
      this.new_sub.timerange = null;
    } else {
      this.timerangeChanged(null, null);
    }
  }

  saveSubscription(): void {
    this.updating = true;
    this.subManagementService.updateSubscription(this.new_sub).subscribe(
      () => this.handleSaveSuccess(),
      err => this.handleSaveError(err)
    );
  }

  private handleSaveSuccess(): void {
    this.updating = false;
    this.sub = this.subManagementService.cloneSubscription(this.new_sub);
  }

  private handleSaveError(err: unknown): void {
    this.updating = false;
    console.error(err);
  }

  getSubscription(): void {
    this.subManagementService.fetchSubscription(this.sub.id).subscribe(res => {
      this.sub = res.subscription;
      this.new_sub = this.subManagementService.cloneSubscription(this.sub);
    });
  }

  timerangeChanged(value: null, select_changed: null): void {
    this.timerange_unit = this.subManagementService.normalizeTimerangeUnit(this.timerange_amount, this.timerange_unit);
    this.subManagementService.updateTimerange(this.new_sub, this.timerange_amount, this.timerange_unit, this.download_all);
  }

  handleTimerangeChange(event: {amount: number, unit: string}): void {
    this.timerange_amount = event.amount;
    this.timerange_unit = event.unit;
    this.timerangeChanged(null, null);
  }

  saveClicked(): void {
    this.saveSubscription();
  }

  async openArgsModifierDialog(): Promise<void> {
    await this.subDialogService.updateCustomArgs(this.new_sub);
  }

  subChanged(): boolean {
    return !this.subManagementService.subscriptionsAreEqual(this.new_sub, this.sub);
  }
}
