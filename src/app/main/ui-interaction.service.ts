import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UntypedFormControl } from '@angular/forms';
import { ArgModifierDialogComponent } from 'app/dialogs/arg-modifier-dialog/arg-modifier-dialog.component';
import { SettingsManager } from './settings.manager';
import { YoutubeSearchManager } from './youtube-search.manager';
import { QualityManager } from './quality.manager';
import { Result } from '../youtube-search.service';

@Injectable({
  providedIn: 'root'
})
export class UiInteractionService {
  urlError = false;

  constructor(
    private dialog: MatDialog,
    private settings: SettingsManager,
    private searchManager: YoutubeSearchManager,
    private qualityManager: QualityManager
  ) {}

  handleInputChange(newValue: string, onValidUrl: () => void): void {
    this.qualityManager.clearSelection();
    if (newValue === '' || !newValue) {
      this.searchManager.clearResults();
    } else {
      if (onValidUrl) {
        this.searchManager.hideResults();
      }
    }
  }

  handleInputBlur(): void {
    this.searchManager.hideResults();
  }

  clearInput(urlSetter: (url: string) => void): void {
    urlSetter('');
    this.searchManager.clearResults();
  }

  useSearchResult(url: string, urlSetter: (url: string) => void): void {
    this.searchManager.hideResults();
    urlSetter(url);
  }

  attachSearchToInput(urlForm: UntypedFormControl, urlGetter: () => string): void {
    this.searchManager.attachToInput(urlForm, urlGetter)
      .subscribe(
        (results: Result[]) => this.searchManager.processSearchResults(results, urlGetter()),
        () => this.searchManager.handleSearchError()
      );
  }

  openArgsModifierDialog(): void {
    const dialogRef = this.dialog.open(ArgModifierDialogComponent, {
      data: {
        initial_args: this.settings.customArgs
      }
    });
    
    dialogRef.afterClosed().subscribe(newArgs => {
      if (newArgs !== null && newArgs !== undefined) {
        this.settings.customArgs = newArgs;
      }
    });
  }
}
