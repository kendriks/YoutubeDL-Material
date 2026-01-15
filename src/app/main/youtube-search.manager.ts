import { Injectable } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { filter, debounceTime, tap, switchMap } from 'rxjs/operators';
import { YoutubeSearchService, Result } from '../youtube-search.service';

@Injectable({
  providedIn: 'root'
})
export class YoutubeSearchManager {
  results: Result[] = [];
  results_loading = false;
  results_showing = true;

  constructor(private youtubeSearch: YoutubeSearchService) {}

  initializeAPI(apiKey: string): void {
    this.youtubeSearch.initializeAPI(apiKey);
  }

  attachToInput(urlForm: UntypedFormControl, urlGetter: () => string): Observable<string> {
    return urlForm.valueChanges
      .pipe(
        filter((text: string) => !!text && text.length > 1),
        debounceTime(250),
        tap(() => this.results_loading = true),
        switchMap((query: string) => this.youtubeSearch.search(query))
      );
  }

  processSearchResults(results: Result[], currentUrl: string): void {
    this.results_loading = false;
    if (currentUrl !== '' && results && results.length > 0) {
      this.results = results;
      this.results_showing = true;
    } else {
      this.results_showing = false;
    }
  }

  handleSearchError(): void {
    this.results_loading = false;
    this.results_showing = false;
  }

  clearResults(): void {
    this.results_showing = false;
  }

  hideResults(): void {
    this.results_showing = false;
  }
}
