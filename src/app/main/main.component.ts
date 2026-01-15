import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { PostsService } from '../posts.services';
import { Subject } from 'rxjs';
import { UntypedFormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RecentVideosComponent } from 'app/components/recent-videos/recent-videos.component';
import { DatabaseFile, Download, Playlist } from 'api-types';
import { DOCUMENT } from '@angular/common';
import { FormatParserHelper, ParsedFormats as ParsedFormatsHelper } from './format-parser.helper';
import { UrlValidatorHelper } from './url-validator.helper';
import { DownloadStateManager } from './download-state.manager';
import { AppConfigManager } from './app-config.manager';
import { YoutubeSearchManager } from './youtube-search.manager';
import { QualityManager } from './quality.manager';
import { SettingsManager } from './settings.manager';
import { DownloadOrchestrator } from './download-orchestrator.service';
import { NavigationService } from './navigation.service';
import { UrlValidationService } from './url-validation.service';
import { EventHandlerService } from './event-handler.service';
import { ComponentLifecycleService } from './component-lifecycle.service';
import { SimulationService } from './simulation.service';
import { UiInteractionService } from './ui-interaction.service';
import { ComponentInitializationService } from './component-initialization.service';


@Component({
  selector: 'app-root',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})

export type ParsedFormats = ParsedFormatsHelper;
export { VideoFormat, AudioFormat } from './format-parser.helper';
export { AvailableFormat } from './quality.manager';

export class MainComponent implements OnInit {
  youtubeAuthDisabledOverride = false;
  iOS = false;
  youtubePassword: string | null = null;
  url = '';
  percentDownloaded: number;
  autoStartDownload = false;
  urlForm = new UntypedFormControl('', [Validators.required]);
  argsChangedSubject: Subject<boolean> = new Subject<boolean>();
  simulatedOutput = '';
  cachedFileManagerEnabled = localStorage.getItem('cached_filemanager_enabled') === 'true';

  @ViewChild('recentVideos') recentVideos: RecentVideosComponent;

  constructor(
    public postsService: PostsService,
    private route: ActivatedRoute,
    @Inject(DOCUMENT) private document: Document,
    public downloadState: DownloadStateManager,
    public searchManager: YoutubeSearchManager,
    public qualityManager: QualityManager,
    public settings: SettingsManager,
    public downloadOrchestrator: DownloadOrchestrator,
    private navigationService: NavigationService,
    private urlValidation: UrlValidationService,
    private eventHandler: EventHandlerService,
    private lifecycle: ComponentLifecycleService,
    private simulation: SimulationService,
    public uiInteraction: UiInteractionService,
    private initialization: ComponentInitializationService
  ) {}


  async configLoad(): Promise<void> {
    await this.lifecycle.loadConfiguration(
      (enabled) => this.cachedFileManagerEnabled = enabled,
      () => this.getSimulatedOutput(),
      () => this.getCurrentDownload()
    );
    if (this.autoStartDownload) this.downloadClicked();
  }

  ngOnInit(): void {
    if (this.postsService.initialized) {
      this.configLoad();
    } else {
      this.postsService.service_initialized.subscribe(init => { if (init) this.configLoad(); });
    }
    this.initialization.setupConfigListeners(() => this.configLoad());
    this.iOS = this.initialization.getPlatformInfo().iOS;
    this.settings.loadFromLocalStorage();
    this.initialization.initializeFromRoute(
      this.route, (url) => this.url = url,
      (value) => this.settings.audioOnly = value, (value) => this.autoStartDownload = value
    );
    this.argsChangedSubject.debounceTime(500).subscribe((should_simulate) => {
      if (should_simulate) this.getSimulatedOutput();
    });
  }

  ngAfterViewInit(): void {
    this.initialization.initializeYoutubeSearch(() => this.attachToInput());
  }

  ngOnDestroy(): void {
    this.lifecycle.stopDownloadPolling();
  }

  downloadHelper(container: DatabaseFile | Playlist, type: string, is_playlist = false, force_view = false, navigate_mode = false): void {
    this.downloadOrchestrator.downloadingFile = false;
    this.navigationService.handleDownloadComplete(
      container, 
      type, 
      is_playlist, 
      force_view, 
      navigate_mode, 
      this.iOS,
      (is_pl) => this.reloadRecentVideos(is_pl)
    );
  }

  downloadClicked(): void {
    this.uiInteraction.urlError = !this.ValidURL(this.url);
    if (this.uiInteraction.urlError) return;

    this.downloadOrchestrator.initiateDownload(
      this.url,
      this.youtubePassword,
      () => this.postsService.openSnackBar($localize`Download failed!`, 'OK.'),
      () => {
        this.postsService.openSnackBar($localize`Download for ${this.url}:url: has been queued!`);
        this.url = '';
        this.downloadOrchestrator.downloadingFile = false;
      }
    );
  }

  cancelDownload(download_to_cancel: Download | null = null): void { this.downloadOrchestrator.cancelDownload(download_to_cancel); }
  visitURL(url: string): void { this.navigationService.visitURL(url, this.document); }
  clearInput(): void { this.uiInteraction.clearInput((url) => this.url = url); }
  onInputBlur(): void { this.uiInteraction.handleInputBlur(); }
  useURL(url: string): void { this.uiInteraction.useSearchResult(url, (newUrl) => this.url = newUrl); }
  inputChanged(new_val: string): void { this.uiInteraction.handleInputChange(new_val, () => this.ValidURL(new_val)); }
  ValidURL(str: string): boolean { return this.urlValidation.validateAndProcess(str, () => this.argsChanged()); }
  getSimulatedOutput(): void { this.simulation.generateAndFormatOutput(this.url, this.youtubePassword, (output) => this.simulatedOutput = output); }
  attachToInput(): void { this.uiInteraction.attachSearchToInput(this.urlForm, () => this.url); }
  argsChanged(): void { this.argsChangedSubject.next(true); }

  videoModeChanged(new_val): void { this.eventHandler.handleVideoModeChange(new_val.checked, () => this.argsChanged()); }
  autoplayChanged(new_val): void { this.eventHandler.handleAutoplayChange(new_val.checked); }
  customArgsEnabledChanged(new_val): void { this.eventHandler.handleCustomArgsEnabledChange(new_val.checked, () => this.argsChanged()); }
  replaceArgsChanged(new_val): void { this.eventHandler.handleReplaceArgsChange(new_val.checked, () => this.argsChanged()); }
  customOutputEnabledChanged(new_val): void { this.eventHandler.handleCustomOutputEnabledChange(new_val.checked, () => this.argsChanged()); }
  youtubeAuthEnabledChanged(new_val): void { this.eventHandler.handleYoutubeAuthEnabledChange(new_val.checked, () => this.argsChanged()); }
  openArgsModifierDialog(): void { this.uiInteraction.openArgsModifierDialog(); }

  getCurrentDownload(): void {
    const currentDownload = this.downloadState.getCurrentDownload();
    if (!currentDownload) return;

    this.postsService.getCurrentDownload(currentDownload['uid']).subscribe(res => {
      if (res['download']) {
        this.percentDownloaded = res['download'].percent_complete;
      }
      this.lifecycle.handleDownloadComplete(
        res,
        (container, type, is_playlist) => this.downloadHelper(container, type, is_playlist)
      );
    });
  }

  reloadRecentVideos(is_playlist = false): void { this.postsService.files_changed.next(true); if (is_playlist) this.postsService.playlists_changed.next(true); }
}