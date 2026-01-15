import { Injectable } from '@angular/core';
import { PostsService } from 'app/posts.services';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

export interface SubscriptionData {
  id: string;
  name: string;
  isPlaylist: boolean;
  [key: string]: any;
}

interface SubscriptionsResponse {
  subscriptions: SubscriptionData[];
}

interface SubscriptionCategories {
  channels: SubscriptionData[];
  playlists: SubscriptionData[];
}

@Injectable({
  providedIn: 'root'
})
export class SubscriptionDataService {

  constructor(private postsService: PostsService) { }

  getAllSubscriptions(): Observable<SubscriptionsResponse> {
    return this.postsService.getAllSubscriptions();
  }

  getSubscriptionByID(id: string): SubscriptionData {
    return this.postsService.getSubscriptionByID(id);
  }

  categorizeSubscriptions(subscriptions: SubscriptionData[]): SubscriptionCategories {
    const channels: SubscriptionData[] = [];
    const playlists: SubscriptionData[] = [];

    subscriptions.forEach(sub => {
      if (sub.isPlaylist) {
        playlists.push(sub);
      } else {
        channels.push(sub);
      }
    });

    return { channels, playlists };
  }

  reloadSubscriptions(): void {
    this.postsService.reloadSubscriptions();
  }
}
