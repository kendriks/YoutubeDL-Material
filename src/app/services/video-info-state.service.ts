import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { DatabaseFile, Category } from 'api-types';

interface VideoInfoState {
  file: DatabaseFile;
  new_file: DatabaseFile;
  upload_date: Date;
  category: Category;
  initialized: boolean;
  write_access: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class VideoInfoStateService {
  constructor(private datePipe: DatePipe) { }

  initializeState(file: DatabaseFile, userUid: string | null): VideoInfoState {
    const new_file = JSON.parse(JSON.stringify(file));
    const upload_date = this.setupUploadDate(new_file.upload_date);
    const category = file.category ? file.category : {};

    if (!file.category) {
      new_file.category = null;
      file.category = null;
    }

    const write_access = !file.user_uid || (file.user_uid && userUid === file.user_uid);

    return {
      file,
      new_file,
      upload_date,
      category,
      initialized: true,
      write_access
    };
  }

  private setupUploadDate(uploadDate: string): Date {
    const date = new Date(uploadDate);
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
    return date;
  }

  getChanges(file: DatabaseFile, new_file: DatabaseFile): Partial<DatabaseFile> {
    const changes: Partial<DatabaseFile> = {};
    Object.keys(new_file).forEach(key => {
      if (file[key] !== new_file[key]) {
        changes[key] = new_file[key];
      }
    });
    return changes;
  }

  hasMetadataChanged(file: DatabaseFile, new_file: DatabaseFile): boolean {
    return JSON.stringify(file) !== JSON.stringify(new_file);
  }

  updateUploadDate(datePipe: DatePipe, event: any): string {
    return datePipe.transform(event.value, 'yyyy-MM-dd');
  }

  updateCategory(selectedCategory: Category): Category {
    return Object.keys(selectedCategory).length ? { uid: selectedCategory.uid, name: selectedCategory.name } : null;
  }

  isCategoryMatch(option: Category, value: Category): boolean {
    if (!option && !value) return true;
    else if (!option || !value) return false;
    return option.uid === value.uid;
  }
}
