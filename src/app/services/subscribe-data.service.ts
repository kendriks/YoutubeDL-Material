import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PostsService } from 'app/posts.services';
import { Subscription } from 'api-types';

interface SubscribePayload {
  url: string;
  name: string | null;
  timerange: string | null;
  maxQuality: string;
  audioOnlyMode: boolean;
  customArgs: string;
  customFileOutput: string;
}

@Injectable({
  providedIn: 'root'
})
export class SubscribeDataService {
  constructor(private postsService: PostsService) { }

  createSubscription(payload: SubscribePayload): Observable<{ new_sub?: Subscription; error?: string }> {
    return this.postsService.createSubscription(
      payload.url,
      payload.name,
      payload.timerange,
      payload.maxQuality,
      payload.audioOnlyMode,
      payload.customArgs,
      payload.customFileOutput
    );
  }

  notifyError(message: string): void {
    this.postsService.openSnackBar(message);
  }
}
