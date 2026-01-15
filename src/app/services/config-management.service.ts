import { Injectable } from '@angular/core';
import { PostsService } from '../posts.services';
import { MatSnackBar } from '@angular/material/snack-bar';

type ConfigObject = Record<string, any>;

@Injectable({
  providedIn: 'root'
})
export class ConfigManagementService {
  private initialConfig: ConfigObject | null = null;
  private newConfig: ConfigObject | null = null;

  constructor(
    private postsService: PostsService,
    private snackBar: MatSnackBar
  ) {}

  loadConfig(): void {
    this.initialConfig = this.postsService.config;
    this.newConfig = JSON.parse(JSON.stringify(this.initialConfig));
  }

  getInitialConfig(): ConfigObject | null {
    return this.initialConfig;
  }

  getNewConfig(): ConfigObject | null {
    return this.newConfig;
  }

  setNewConfig(config: ConfigObject): void {
    this.newConfig = config;
  }

  isConfigChanged(): boolean {
    return JSON.stringify(this.newConfig) !== JSON.stringify(this.initialConfig);
  }

  saveSettings(): void {
    const settingsToSave = {'YoutubeDLMaterial': this.newConfig};
    this.postsService.setConfig(settingsToSave).subscribe(res => {
      if (res['success']) {
        if (!this.initialConfig['Advanced']['multi_user_mode'] && this.newConfig['Advanced']['multi_user_mode']) {
          this.postsService.checkAdminCreationStatus(true);
        }
        this.initialConfig = JSON.parse(JSON.stringify(this.newConfig));
        this.postsService.reload_config.next(true);
      }
    }, () => {
      console.error('Failed to save config!');
    });
  }

  cancelSettings(): void {
    this.newConfig = JSON.parse(JSON.stringify(this.initialConfig));
  }
}
