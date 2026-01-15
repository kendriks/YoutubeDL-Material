import { Injectable } from '@angular/core';

export interface PropertyOption {
  value: string;
  label: string;
}

@Injectable({
  providedIn: 'root'
})
export class CategoryPropertyService {

  getPropertyOptions(): PropertyOption[] {
    return [
      { value: 'fulltitle', label: 'Title' },
      { value: 'id', label: 'ID' },
      { value: 'webpage_url', label: 'URL' },
      { value: 'view_count', label: 'Views' },
      { value: 'uploader', label: 'Uploader' },
      { value: '_filename', label: 'File Name' },
      { value: 'tags', label: 'Tags' }
    ];
  }

  getComparatorOptions(): PropertyOption[] {
    return [
      { value: 'includes', label: 'includes' },
      { value: 'not_includes', label: 'not includes' },
      { value: 'equals', label: 'equals' },
      { value: 'not_equals', label: 'not equals' }
    ];
  }
}
