import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Platform } from '@angular/cdk/platform';
import { PostsService } from '../posts.services';
import { SettingsManager } from './settings.manager';
import { YoutubeSearchManager } from './youtube-search.manager';

@Injectable({
  providedIn: 'root'
})
export class ComponentInitializationService {
  constructor(
    private platform: Platform,
    private postsService: PostsService,
    private settings: SettingsManager,
    private searchManager: YoutubeSearchManager
  ) {}

  initializeFromRoute(
    route: ActivatedRoute,
    urlSetter: (url: string) => void,
    audioOnlySetter: (value: boolean) => void,
    autoStartSetter: (value: boolean) => void
  ): void {
    const urlParam = route.snapshot.paramMap.get('url');
    if (urlParam) {
      urlSetter(decodeURIComponent(urlParam));
      audioOnlySetter(route.snapshot.paramMap.get('audioOnly') === 'true');
      autoStartSetter(true);
    }
  }

  getPlatformInfo(): { iOS: boolean } {
    return {
      iOS: this.platform.IOS
    };
  }

  setupConfigListeners(onConfigReload: () => Promise<boolean>): void {
    this.postsService.config_reloaded.subscribe(changed => {
      if (changed) {
        onConfigReload();
      }
    });
  }

  initializeYoutubeSearch(onAttachToInput: () => void): void {
    if (this.settings.youtubeSearchEnabled && this.settings.youtubeAPIKey) {
      this.searchManager.initializeAPI(this.settings.youtubeAPIKey);
      onAttachToInput();
    }
  }
}