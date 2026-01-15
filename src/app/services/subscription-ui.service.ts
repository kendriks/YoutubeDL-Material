import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { EditSubscriptionDialogComponent } from 'app/dialogs/edit-subscription-dialog/edit-subscription-dialog.component';
import { PostsService } from 'app/posts.services';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionUiService {
  constructor(
    private dialog: MatDialog,
    private router: Router,
    private postsService: PostsService
  ) { }

  openEditDialog(subscriptionId: string): void {
    this.dialog.open(EditSubscriptionDialogComponent, {
      data: {
        sub: this.postsService.getSubscriptionByID(subscriptionId)
      }
    });
  }

  navigateToWatch(subscriptionId: string): void {
    this.router.navigate(['/player', { sub_id: subscriptionId }]);
  }

  navigateBack(): void {
    this.router.navigate(['/subscriptions']);
  }

  downloadZip(blob: Blob, filename: string): void {
    const { saveAs } = window as any;
    saveAs(blob, filename + '.zip');
  }
}
