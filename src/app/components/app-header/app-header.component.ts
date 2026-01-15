import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { PostsService } from '../posts.services';
import { ThemeService } from '../services/theme.service';
import { DialogService } from '../services/dialog.service';
import { AppStateService } from '../services/app-state.service';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.css']
})
export class AppHeaderComponent implements OnInit {
  @Input() allowThemeChange: boolean;
  @Output() hamburgerClicked = new EventEmitter<void>();
  @Output() backClicked = new EventEmitter<void>();
  @Output() notificationOpened = new EventEmitter<void>();
  @Output() notificationClosed = new EventEmitter<void>();
  @Output() notificationCountUpdate = new EventEmitter<number>();

  notificationCount$ = this.appState.notificationCount$;
  topBarTitle$ = this.appState.topBarTitle$;

  constructor(
    public postsService: PostsService,
    private themeService: ThemeService,
    private dialogService: DialogService,
    private appState: AppStateService
  ) {}

  ngOnInit(): void {}

  toggleHamburger(): void {
    this.hamburgerClicked.emit();
  }

  goBack(): void {
    this.backClicked.emit();
  }

  openProfileDialog(): void {
    this.dialogService.openProfile();
  }

  openArchivesDialog(): void {
    this.dialogService.openArchives();
  }

  openAboutDialog(): void {
    this.dialogService.openAbout();
  }

  toggleTheme(event: Event): void {
    this.themeService.flipTheme();
    event.stopPropagation();
  }

  onNotificationMenuOpened(): void {
    this.notificationOpened.emit();
  }

  onNotificationMenuClosed(): void {
    this.notificationClosed.emit();
  }

  onNotificationCountUpdate(count: number): void {
    this.notificationCountUpdate.emit(count);
  }
}
