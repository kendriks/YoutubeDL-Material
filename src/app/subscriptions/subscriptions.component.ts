import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PostsService } from 'app/posts.services';
import { SubscriptionDataService, SubscriptionData } from 'app/services/subscription-data.service';
import { SubscriptionDialogManagerService } from 'app/services/subscription-dialog-manager.service';
import { SubscriptionNotificationService } from 'app/services/subscription-notification.service';

@Component({
  selector: 'app-subscriptions',
  templateUrl: './subscriptions.component.html',
  styleUrls: ['./subscriptions.component.scss']
})
export class SubscriptionsComponent implements OnInit {
  channel_subscriptions: SubscriptionData[] = [];
  playlist_subscriptions: SubscriptionData[] = [];
  subscriptions: SubscriptionData[] | null = null;
  subscriptions_loading = false;

  constructor(
    private postsService: PostsService,
    private router: Router,
    private subDataService: SubscriptionDataService,
    private subDialogService: SubscriptionDialogManagerService,
    private notificationService: SubscriptionNotificationService
  ) { }

  ngOnInit(): void {
    const init = () => this.getSubscriptions();
    this.postsService.initialized ? init() : this.postsService.service_initialized.subscribe(isInit => isInit && init());
  }

  getSubscriptions(show_loading = true): void {
    if (show_loading) this.subscriptions_loading = true;
    this.subscriptions = null;
    this.subDataService.getAllSubscriptions().subscribe(
      res => this.onSubscriptionsLoaded(res.subscriptions),
      err => this.onSubscriptionsError(err)
    );
  }

  private onSubscriptionsLoaded(subscriptions: SubscriptionData[]): void {
    this.subscriptions_loading = false;
    this.subscriptions = subscriptions || [];
    const cat = this.subDataService.categorizeSubscriptions(this.subscriptions);
    this.channel_subscriptions = cat.channels;
    this.playlist_subscriptions = cat.playlists;
  }

  private onSubscriptionsError(err: unknown): void {
    this.subscriptions_loading = false;
    this.notificationService.showErrorMessage('ERROR: Failed to get subscriptions!');
  }

  goToSubscription(sub: SubscriptionData): void {
    this.router.navigate(['/subscription', { id: sub.id }]);
  }

  openSubscribeDialog(): void {
    this.subDialogService.openSubscribeDialog().subscribe(result => {
      if (result) {
        this.addToList(result);
        this.subDataService.reloadSubscriptions();
      }
    });
  }

  private addToList(sub: SubscriptionData): void {
    (sub.isPlaylist ? this.playlist_subscriptions : this.channel_subscriptions).push(sub);
  }

  showSubInfo(sub: SubscriptionData): void {
    this.subDialogService.openSubInfoDialog(sub).subscribe(success => {
      if (success) {
        this.notificationService.showDeleteConfirmation(sub.name);
        this.getSubscriptions();
        this.subDataService.reloadSubscriptions();
      }
    });
  }

  editSubscription(sub: SubscriptionData): void {
    this.subDialogService.openEditSubscriptionDialog(this.subDataService.getSubscriptionByID(sub.id))
      .afterClosed().subscribe(() => this.getSubscriptions(false));
  }
}
