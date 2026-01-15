import { Injectable } from '@angular/core';
import { PostsService } from 'app/posts.services';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface Subscription {
  id: string;
  type: string;
  timerange: string | null;
  custom_args: string;
  custom_output?: string;
  paused?: boolean;
  maxQuality?: string;
  videos?: Video[];
  [key: string]: string | null | boolean | Video[] | undefined;
}

export interface Video {
  id: string;
  title: string;
  [key: string]: any;
}

export interface TimerangeInfo {
  amount: number;
  unit: string;
}

@Injectable({
  providedIn: 'root'
})
export class SubscriptionManagementService {

  constructor(private postsService: PostsService) { }

  cloneSubscription(sub: Subscription): Subscription {
    return JSON.parse(JSON.stringify(sub));
  }

  removeVideosField(sub: Subscription): void {
    delete sub.videos;
  }

  isAudioMode(sub: Subscription): boolean {
    return sub.type === 'audio';
  }

  shouldDownloadAll(sub: Subscription): boolean {
    return !sub.timerange;
  }

  parseTimerange(timerangeStr: string): TimerangeInfo {
    const parts = timerangeStr.split('-')[1];
    const amount = parseInt(parts.replace(/\D/g, ''));
    let unit = parts.replace(/[0-9]/g, '');

    if (amount === 1) {
      unit = unit.replace('s', '');
    }

    return { amount, unit };
  }

  normalizeTimerangeUnit(amount: number, unit: string): string {
    if (amount === 1) {
      return unit.replace('s', '');
    }
    if (!unit.includes('s')) {
      return unit + 's';
    }
    return unit;
  }

  buildTimerange(amount: number, unit: string): string | null {
    if (amount && unit) {
      return `now-${amount}${unit}`;
    }
    return null;
  }

  updateTimerange(sub: Subscription, amount: number, unit: string, downloadAll: boolean): void {
    if (downloadAll) {
      sub.timerange = null;
    } else {
      sub.timerange = this.buildTimerange(amount, unit);
    }
  }

  updateSubscription(sub: Subscription): Observable<any> {
    return this.postsService.updateSubscription(sub).pipe(
      tap(() => this.postsService.reloadSubscriptions())
    );
  }

  fetchSubscription(id: string): Observable<{subscription: Subscription}> {
    return this.postsService.getSubscription(id);
  }

  subscriptionsAreEqual(sub1: Subscription, sub2: Subscription): boolean {
    return JSON.stringify(sub1) === JSON.stringify(sub2);
  }
}
