import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Download } from 'api-types';

@Injectable({
  providedIn: 'root'
})
export class DownloadNavigationService {

  constructor(private router: Router) {}

  watchContent(download: Download, currentUrl: string): void {
    const container = download['container'];
    localStorage.setItem('player_navigator', currentUrl.split(';')[0]);
    const isPlaylist = container['uids'];
    
    if (isPlaylist) {
      this.router.navigate(['/player', {playlist_id: container['id'], type: download['type']}]);
    } else {
      this.router.navigate(['/player', {type: download['type'], uid: container['uid']}]);
    }
  }

  navigateToHome(): void {
    this.router.navigate(['/home']);
  }
}
