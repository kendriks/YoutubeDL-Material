import { Injectable } from '@angular/core';
import { Observable, interval } from 'rxjs';
import { PostsService } from 'app/posts.services';
import { Subscription } from 'api-types';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionStateService {
  constructor(private postsService: PostsService) { }

  getSubscriptionUpdates(id: string, pollingInterval = 1000): Observable<Subscription> {
    return new Observable(observer => {
      const subscription = interval(pollingInterval).subscribe(() => {
        this.postsService.getSubscription(id).subscribe(res => {
          observer.next(res['subscription']);
        });
      });
      return () => subscription.unsubscribe();
    });
  }

  getSubscriptionOnce(id: string): Observable<any> {
    return this.postsService.getSubscription(id);
  }

  getArchiveConfig(): boolean {
    return this.postsService.config['Downloader']['use_youtubedl_archive'];
  }
}
