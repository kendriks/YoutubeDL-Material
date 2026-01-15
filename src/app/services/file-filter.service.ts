import { Injectable } from '@angular/core';
import { FileTypeFilter } from '../../../api-types';

@Injectable({
  providedIn: 'root'
})
export class FileFilterService {

  getFileTypeFilter(selectedFilters: string[]): FileTypeFilter {
    return selectedFilters.includes('audio_only') ? 'audio_only' : 
           selectedFilters.includes('video_only') ? 'video_only' : 'both';
  }

  getFavoriteFilter(selectedFilters: string[]): boolean {
    return selectedFilters.includes('favorited');
  }

  getFilterKey(newFilters: string[], currentFilters: string[]): string {
    return newFilters.filter(k => !currentFilters.includes(k))[0];
  }

  removeIncompatibleFilters(
    selectedFilters: string[],
    filterKey: string,
    fileFilters: Record<string, any>
  ): string[] {
    return selectedFilters.filter(f => 
      !fileFilters[f].incompatible || 
      !fileFilters[f].incompatible.includes(filterKey)
    );
  }
}
