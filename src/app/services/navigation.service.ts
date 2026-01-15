import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  constructor(private router: Router) {}

  initialize(): void {
    // Router initialization if needed
  }

  goBack(): void {
    const navigator = localStorage.getItem('player_navigator');
    if (!navigator) {
      this.router.navigate(['/home']);
    } else {
      this.router.navigateByUrl(navigator);
    }
  }

  navigateTo(commands: any[]): void {
    this.router.navigate(commands);
  }

  getCurrentUrl(): string {
    return this.router.url;
  }
}

// Import at the end to avoid circular dependency
import { NavigationEnd } from '@angular/router';
