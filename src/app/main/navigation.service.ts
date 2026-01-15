import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { PostsService } from '../posts.services';
import { DatabaseFile, Playlist } from 'api-types';
import { saveAs } from 'file-saver';
import { SettingsManager } from './settings.manager';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  
  constructor(
    private router: Router,
    private postsService: PostsService,
    private settings: SettingsManager
  ) {}

  handleDownloadComplete(
    container: DatabaseFile | Playlist, 
    type: string, 
    is_playlist: boolean, 
    force_view: boolean, 
    navigate_mode: boolean,
    iOS: boolean,
    onReload: (is_playlist: boolean) => void
  ): void {
    if (!this.settings.autoplay && !this.settings.downloadOnlyMode && !navigate_mode) {
      onReload(is_playlist);
    } else {
      if (force_view === false && this.settings.downloadOnlyMode && !iOS) {
        if (is_playlist) {
          this.downloadPlaylist(container['uid']);
        } else {
          this.downloadFileFromServer(container as DatabaseFile, type);
        }
        onReload(is_playlist);
      } else {
        this.navigateToPlayer(container, type, is_playlist);
      }
    }
  }

  navigateToPlayer(container: DatabaseFile | Playlist, type: string, is_playlist: boolean): void {
    localStorage.setItem('player_navigator', this.router.url.split(';')[0]);
    if (is_playlist) {
      this.router.navigate(['/player', {playlist_id: container['id'], type: type}]);
    } else {
      this.router.navigate(['/player', {type: type, uid: container['uid']}]);
    }
  }

  downloadFileFromServer(file: DatabaseFile, type: string): void {
    const ext = type === 'audio' ? 'mp3' : 'mp4';
    this.postsService.downloadFileFromServer(file.uid).subscribe(res => {
      const blob: Blob = res;
      saveAs(blob, decodeURIComponent(file.id) + `.${ext}`);

      if (!this.settings.fileManagerEnabled) {
        this.postsService.deleteFile(file.uid).subscribe(() => {});
      }
    });
  }

  downloadPlaylist(playlist: Playlist): void {
    this.postsService.downloadPlaylistFromServer(playlist.id).subscribe(res => {
      const blob: Blob = res;
      saveAs(blob, playlist.name + '.zip');
    });
  }

  visitURL(url: string, document: Document): void {
    document.defaultView?.open(url);
  }
}
