import { Component, Input } from '@angular/core';
import { DatabaseFile } from 'api-types';
import { filesize } from 'filesize';

@Component({
  selector: 'app-video-info-display',
  template: `
    <mat-divider style="margin-bottom: 16px;"></mat-divider>
    <div *ngIf="!file.isAudio" class="info-item">
      <div class="info-item-label"><strong><ng-container i18n="Video resolution property">Resolution:</ng-container>&nbsp;</strong></div>
      <div class="info-item-value">{{file.height ? file.height + 'p' : 'N/A'}}</div>
    </div>
    <div class="info-item">
      <div class="info-item-label"><strong><ng-container i18n="Video audio bitrate property">Audio bitrate:</ng-container>&nbsp;</strong></div>
      <div class="info-item-value">{{file.abr ? file.abr + ' Kbps' : 'N/A'}}</div>
    </div>
    <div class="info-item">
      <div class="info-item-label"><strong><ng-container i18n="Video file size property">File size:</ng-container>&nbsp;</strong></div>
      <div class="info-item-value">{{file.size ? filesize(file.size) : 'N/A'}}</div>
    </div>
    <div class="info-item">
      <div class="info-item-label"><strong><ng-container i18n="Video path property">Path:</ng-container>&nbsp;</strong></div>
      <div class="info-item-value">{{file.path ? file.path : 'N/A'}}</div>
    </div>
  `
})
export class VideoInfoDisplayComponent {
  @Input() file: DatabaseFile;
  filesize = filesize;
}
