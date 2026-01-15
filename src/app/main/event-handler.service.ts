import { Injectable } from '@angular/core';
import { SettingsManager } from './settings.manager';
import { QualityManager } from './quality.manager';

@Injectable({
  providedIn: 'root'
})
export class EventHandlerService {
  
  constructor(
    private settings: SettingsManager,
    private qualityManager: QualityManager
  ) {}

  handleVideoModeChange(checked: boolean, onArgsChanged: () => void): void {
    this.qualityManager.clearSelection();
    this.settings.audioOnly = checked;
    this.settings.saveLocalSetting('audioOnly', checked.toString());
    onArgsChanged();
  }

  handleAutoplayChange(checked: boolean): void {
    this.settings.autoplay = checked;
    this.settings.saveLocalSetting('autoplay', checked.toString());
  }

  handleCustomArgsEnabledChange(checked: boolean, onArgsChanged: () => void): void {
    this.settings.customArgsEnabled = checked;
    this.settings.saveLocalSetting('customArgsEnabled', checked.toString());
    onArgsChanged();
  }

  handleReplaceArgsChange(checked: boolean, onArgsChanged: () => void): void {
    this.settings.replaceArgs = checked;
    this.settings.saveLocalSetting('replaceArgs', checked.toString());
    onArgsChanged();
  }

  handleCustomOutputEnabledChange(checked: boolean, onArgsChanged: () => void): void {
    this.settings.customOutputEnabled = checked;
    this.settings.saveLocalSetting('customOutputEnabled', checked.toString());
    onArgsChanged();
  }

  handleYoutubeAuthEnabledChange(checked: boolean, onArgsChanged: () => void): void {
    this.settings.youtubeAuthEnabled = checked;
    this.settings.saveLocalSetting('youtubeAuthEnabled', checked.toString());
    onArgsChanged();
  }
}