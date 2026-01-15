import { Injectable } from '@angular/core';
import { PostsService } from '../posts.services';
import { DomSanitizer } from '@angular/platform-browser';
import { Renderer2 } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Injectable({
  providedIn: 'root'
})
export class BookmarkletService {
  private bookmarkletAudioOnly = false;
  private generatedBookmarkletCode = null;

  constructor(
    private sanitizer: DomSanitizer,
    private renderer: Renderer2,
    private postsService: PostsService
  ) {
    this.generatedBookmarkletCode = this.sanitizer.bypassSecurityTrustUrl(this.generateCode());
  }

  getGeneratedCode(): any {
    return this.generatedBookmarkletCode;
  }

  generateCode(): string {
    const currentURL = window.location.href.split('#')[0];
    const homePageWithArgsURL = currentURL + '#/home;url=';
    const audioOnly = this.bookmarkletAudioOnly;
    const bookmarkletCode = `javascript:(function()%7Bwindow.open('${homePageWithArgsURL}' + encodeURIComponent(window.location) + ';audioOnly=${audioOnly}')%7D)()`;
    return bookmarkletCode;
  }

  audioOnlyChanged(event: MatCheckboxChange): void {
    this.bookmarkletAudioOnly = event.checked;
    this.generatedBookmarkletCode = this.sanitizer.bypassSecurityTrustUrl(this.generateCode());
  }

  generateBookmarklet(): void {
    this.bookmarkSite('YTDL-Material', this.generatedBookmarkletCode);
  }

  private bookmarkSite(title: string, url: string): void {
    if (window['external'] && typeof window['external']['AddFavorite'] === 'function') {
        window['external']['AddFavorite'](url, title);
    } else if (window['chrome']) {
       this.postsService.openSnackBar($localize`Chrome users must drag the 'Alternate URL' link to your bookmarks.`);
    } else if (window['sidebar']) {
        window['sidebar'].addPanel(title, url, '');
    } else if (window['opera'] && window.print) {
       const elem = this.renderer.createElement('a');
       this.renderer.setAttribute(elem, 'href', url);
       this.renderer.setAttribute(elem, 'title', title);
       this.renderer.setAttribute(elem, 'rel', 'sidebar');
       elem.click();
    }
  }
}
