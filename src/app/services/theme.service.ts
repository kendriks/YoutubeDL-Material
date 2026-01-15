import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Renderer2, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { OverlayContainer } from '@angular/cdk/overlay';
import { THEMES_CONFIG } from '../themes';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private currentTheme = new BehaviorSubject<string>(null);
  public theme$ = this.currentTheme.asObservable();

  constructor(
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document,
    private overlayContainer: OverlayContainer
  ) {}

  initializeTheme(): void {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      this.setTheme(storedTheme);
    }
  }

  setTheme(theme: string): void {
    if (!THEMES_CONFIG[theme]) {
      console.error('Invalid theme: ' + theme);
      return;
    }

    const oldTheme = localStorage.getItem('theme');
    localStorage.setItem('theme', theme);
    
    this.applyThemeStyles(theme, oldTheme);
    this.currentTheme.next(theme);
  }

  flipTheme(): void {
    const currentTheme = localStorage.getItem('theme') || 'default';
    const nextTheme = currentTheme === 'default' ? 'dark' : 'default';
    this.setTheme(nextTheme);
  }

  getThemeConfig(): any {
    return THEMES_CONFIG;
  }

  private applyThemeStyles(theme: string, oldTheme: string | null): void {
    const themeConfig = THEMES_CONFIG[theme];
    this.renderer.setStyle(this.document.body, 'backgroundColor', themeConfig['background_color']);
    
    const themeLabel = themeConfig['css_label'];
    const oldThemeLabel = oldTheme ? THEMES_CONFIG[oldTheme]?.['css_label'] : null;

    if (oldThemeLabel) {
      this.renderer.removeClass(this.document.body, oldThemeLabel);
      this.renderer.removeClass(this.overlayContainer.getContainerElement(), oldThemeLabel);
    }

    this.renderer.addClass(this.overlayContainer.getContainerElement(), themeLabel);
  }

  getCurrentTheme(): string {
    return localStorage.getItem('theme') || 'default';
  }
}
