import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { SubscriptionData } from 'api-types';
import { SubscriptionStateService } from 'app/services/subscription-state.service';
import { SubscriptionActionsService } from 'app/services/subscription-actions.service';
import { SubscriptionUiService } from 'app/services/subscription-ui.service';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss']
})
export class SubscriptionComponent implements OnInit, OnDestroy {
  subscription: SubscriptionData = null;
  downloading = false;
  check_clicked = false;
  cancel_clicked = false;

  private id: string;
  private pollingSubscription: Subscription | null = null;
  private previousVideoCount = 0;
  private subscriptions: Subscription[] = [];

  constructor(
    private route: ActivatedRoute,
    private stateService: SubscriptionStateService,
    private actionsService: SubscriptionActionsService,
    private uiService: SubscriptionUiService
  ) { }

  ngOnInit(): void {
    this.subscriptions.push(
      this.route.params.subscribe(params => {
        this.id = params['id'];
        this.setupPolling();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    if (this.pollingSubscription) this.pollingSubscription.unsubscribe();
  }

  private setupPolling(): void {
    if (this.pollingSubscription) this.pollingSubscription.unsubscribe();
    this.pollingSubscription = this.stateService.getSubscriptionUpdates(this.id)
      .subscribe(sub => this.onSubscriptionUpdate(sub));
  }

  private onSubscriptionUpdate(sub: SubscriptionData): void {
    if (sub.videos.length > this.previousVideoCount) {
      const postsService = require('app/posts.services').PostsService.prototype;
      postsService.files_changed?.next(true);
    }
    this.previousVideoCount = sub.videos.length;
    this.subscription = sub;
  }

  private updateClickState(type: 'check' | 'cancel'): void {
    if (type === 'check') this.check_clicked = false;
    else this.cancel_clicked = false;
  }

  goBack(): void {
    this.uiService.navigateBack();
  }

  editSubscription(): void {
    this.uiService.openEditDialog(this.subscription.id);
  }

  watchSubscription(): void {
    this.uiService.navigateToWatch(this.subscription.id);
  }

  checkSubscription(): void {
    this.check_clicked = true;
    this.actionsService.checkSubscription(this.subscription.id)
      .pipe(
        tap(
          (res: { success: boolean }) => {
            this.updateClickState('check');
            if (!res.success) this.actionsService.notifyError('Failed to check subscription!');
          },
          () => {
            this.updateClickState('check');
            this.actionsService.notifyError('Failed to check subscription!');
          }
        )
      )
      .subscribe();
  }

  cancelCheckSubscription(): void {
    this.cancel_clicked = true;
    this.actionsService.cancelCheckSubscription(this.subscription.id)
      .pipe(
        tap(
          (res: { success: boolean }) => {
            this.updateClickState('cancel');
            if (!res.success) this.actionsService.notifyError('Failed to cancel check subscription!');
          },
          () => {
            this.updateClickState('cancel');
            this.actionsService.notifyError('Failed to cancel check subscription!');
          }
        )
      )
      .subscribe();
  }

  downloadContent(): void {
    this.downloading = true;
    this.actionsService.downloadSubscriptionContent(this.subscription.id)
      .pipe(
        tap(
          (blob: Blob) => {
            this.downloading = false;
            this.uiService.downloadZip(blob, this.subscription.name);
          },
          () => {
            this.downloading = false;
            this.actionsService.notifyError('Failed to download subscription!');
          }
        )
      )
      .subscribe();
  }
}
