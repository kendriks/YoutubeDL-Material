import { Component, OnInit } from '@angular/core';
import { PostsService } from 'app/posts.services';
import { ActivatedRoute, Router } from '@angular/router';
import { CURRENT_VERSION } from 'app/consts';
import { ConfigManagementService } from '../services/config-management.service';
import { SettingsCategoryService } from '../services/settings-category.service';
import { BookmarkletService } from '../services/bookmarklet.service';
import { DatabaseManagementService } from '../services/database-management.service';
import { DownloaderManagementService } from '../services/downloader-management.service';
import { ServerManagementService } from '../services/server-management.service';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Category, DBInfoResponse } from 'api-types';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { SafeUrl } from '@angular/platform-browser';

type ConfigObject = Record<string, any>;
type GitHubRelease = Record<string, any>;

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  CURRENT_VERSION = CURRENT_VERSION;

  tabs = ['main', 'downloader', 'extra', 'database', 'notifications', 'advanced', 'users', 'logs'];
  tabIndex = 0;
  
  INDEX_TO_TAB = Object.assign({}, this.tabs);
  TAB_TO_INDEX = {};
  
  usersTabDisabledTooltip = $localize`You must enable multi-user mode to access this tab.`;

  get settingsAreTheSame(): boolean {
    return this.configService.isConfigChanged();
  }

  get newConfig(): ConfigObject | null {
    return this.configService.getNewConfig();
  }

  get initialConfig(): ConfigObject | null {
    return this.configService.getInitialConfig();
  }

  get dbInfo(): DBInfoResponse {
    return this.dbService.getDbInfo();
  }

  get dbTransferring(): boolean {
    return this.dbService.isDbTransferring();
  }

  get testingConnectionString(): boolean {
    return this.dbService.isTestingConnectionString();
  }

  get generatedBookmarkletCode(): SafeUrl {
    return this.bookmarkletService.getGeneratedCode();
  }

  get latestGithubRelease(): GitHubRelease | null {
    return this.serverService.getRelease();
  }

  constructor(
    public postsService: PostsService,
    private router: Router,
    private route: ActivatedRoute,
    private configService: ConfigManagementService,
    private categoryService: SettingsCategoryService,
    private bookmarkletService: BookmarkletService,
    private dbService: DatabaseManagementService,
    private downloaderService: DownloaderManagementService,
    private serverService: ServerManagementService
  ) {
    Object.keys(this.INDEX_TO_TAB).forEach(key => { this.TAB_TO_INDEX[this.INDEX_TO_TAB[key]] = key; });
  }

  ngOnInit(): void {
    if (this.postsService.initialized) {
      this.initialize();
    } else {
      this.postsService.service_initialized.subscribe(init => {
        if (init) {
          this.initialize();
        }
      });
    }

    const tab = this.route.snapshot.paramMap.get('tab');
    this.tabIndex = tab && this.TAB_TO_INDEX[tab] ? this.TAB_TO_INDEX[tab] : 0;
  }

  private initialize(): void {
    this.configService.loadConfig();
    this.dbService.getDBInfo();
    this.serverService.getLatestGithubRelease();
  }

  saveSettings(): void {
    this.configService.saveSettings();
  }

  cancelSettings(): void {
    this.configService.cancelSettings();
  }

  tabChanged(event: { index: number }): void {
    const index = event['index'];
    this.router.navigate(['/settings', {tab: this.INDEX_TO_TAB[index]}]);
  }

  dropCategory(event: CdkDragDrop<string[]>): void {
    this.categoryService.dropCategory(event);
  }

  openAddCategoryDialog(): void {
    this.categoryService.openAddCategoryDialog();
  }

  deleteCategory(category: Category): void {
    this.categoryService.deleteCategory(category);
  }

  openEditCategoryDialog(category: Category): void {
    this.categoryService.openEditCategoryDialog(category);
  }

  generateAPIKey(): void {
    this.downloaderService.generateAPIKey();
  }

  generateBookmarklet(): void {
    this.bookmarkletService.generateBookmarklet();
  }

  bookmarkletAudioOnlyChanged(event: MatCheckboxChange): void {
    this.bookmarkletService.audioOnlyChanged(event);
  }

  openArgsModifierDialog(): void {
    this.downloaderService.openArgsModifierDialog(this.newConfig['Downloader']['custom_args']);
  }

  openCookiesUploaderDialog(): void {
    this.downloaderService.openCookiesUploaderDialog();
  }

  killAllDownloads(): void {
    this.downloaderService.killAllDownloads();
  }

  restartServer(): void {
    this.serverService.restartServer();
  }

  transferDB(): void {
    this.dbService.transferDB();
  }

  testConnectionString(connectionString: string): void {
    this.dbService.testConnectionString(connectionString);
  }

  openGenerateRSSURLDialog(): void {
    this.downloaderService.openGenerateRSSURLDialog();
  }
}
