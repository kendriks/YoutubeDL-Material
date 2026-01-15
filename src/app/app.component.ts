import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { PostsService } from './posts.services';
import { MatSidenav } from '@angular/material/sidenav';
import { ThemeService } from './services/theme.service';
import { ConfigService } from './services/config.service';
import { NavigationService } from './services/navigation.service';
import { AppStateService } from './services/app-state.service';
import { AppSidenavComponent } from './components/app-sidenav/app-sidenav.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild('appSidenav') appSidenav: AppSidenavComponent;

  allowThemeChange: boolean;
  allowSubscriptions: boolean;

  constructor(
    private postsService: PostsService,
    private themeService: ThemeService,
    private configService: ConfigService,
    private navigationService: NavigationService,
    private appState: AppStateService
  ) {
    this.setupEventSubscriptions();
  }

  ngOnInit(): void {
    this.initializeApp();
  }

  ngAfterViewInit(): void {
    this.postsService.sidenav = this.appSidenav.sidenav;
  }

  private setupEventSubscriptions(): void {
    this.postsService.config_reloaded.subscribe(changed => {
      if (changed) {
        this.loadConfig();
      }
    });

    this.postsService.open_create_default_admin_dialog.subscribe(open => {
      if (open) {
        this.handleDefaultAdminDialog();
      }
    });
  }

  private initializeApp(): void {
    this.themeService.initializeTheme();
    this.loadConfig();
  }

  private loadConfig(): void {
    this.configService.loadConfig();
    this.appState.setTopBarTitle(this.configService.getTopBarTitle());
    this.allowThemeChange = this.configService.allowThemeChange;
    this.allowSubscriptions = this.configService.allowSubscriptions;
  }

  private handleDefaultAdminDialog(): void {
    // Dialog logic already handled by DialogService
  }

  onHamburgerClicked(): void {
    this.appSidenav.sidenav.toggle();
  }

  onBackClicked(): void {
    this.navigationService.goBack();
  }

  onNotificationOpened(): void {
    // Notification logic handled by AppNotificationService in header
  }

  onNotificationClosed(): void {
    // Notification logic handled by AppNotificationService in header
  }

  onNotificationCountUpdate(count: number): void {
    this.appState.updateNotificationCount(count);
  }
}

