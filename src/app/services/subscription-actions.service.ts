import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PostsService } from 'app/posts.services';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionActionsService {
  constructor(private postsService: PostsService) { }

  checkSubscription(id: string): Observable<any> {
    return this.postsService.checkSubscription(id);
  }

  cancelCheckSubscription(id: string): Observable<any> {
    return this.postsService.cancelCheckSubscription(id);
  }

  downloadSubscriptionContent(id: string): Observable<Blob> {
    return this.postsService.downloadSubFromServer(id);
  }

  notifyError(message: string): void {
    this.postsService.openSnackBar(message);
  }
}
