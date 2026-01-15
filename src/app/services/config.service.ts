import { Injectable } from '@angular/core';
import { PostsService } from '../posts.services';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  topBarTitle = 'Youtube Downloader';
  defaultTheme: string | null = null;
  allowThemeChange: boolean | null = null;
  allowSubscriptions = false;
  enableDownloadsManager = false;

  constructor(private postsService: PostsService) {}

  loadConfig(): void {
    const config = this.postsService.config;
    
    this.topBarTitle = config['Extra']['title_top'];
    
    const themingExists = config['Themes'];
    this.defaultTheme = themingExists ? config['Themes']['default_theme'] : 'default';
    this.allowThemeChange = themingExists ? config['Themes']['allow_theme_change'] : true;
    this.allowSubscriptions = config['Subscriptions']['allow_subscriptions'];
    this.enableDownloadsManager = config['Extra']['enable_downloads_manager'];

    this.initializeResources();
  }

  private initializeResources(): void {
    if (this.allowSubscriptions) {
      this.postsService.reloadSubscriptions();
    }
    this.postsService.reloadCategories();
    this.postsService.getVersionInfo().subscribe(res => {
      this.postsService.version_info = res['version_info'];
    });
  }

  getTopBarTitle(): string {
    return this.topBarTitle;
  }

  isSubscriptionsAllowed(): boolean {
    return this.allowSubscriptions;
  }

  isDownloadsManagerEnabled(): boolean {
    return this.enableDownloadsManager;
  }
}
