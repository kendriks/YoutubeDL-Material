import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PostsService } from 'app/posts.services';
import { Category, DatabaseFile } from 'api-types';
import { DatePipe } from '@angular/common';
import { VideoInfoDataService } from 'app/services/video-info-data.service';
import { VideoInfoStateService } from 'app/services/video-info-state.service';

interface DateChangeEvent {
  value: Date;
}

interface SelectionChangeEvent {
  value: Category;
}

@Component({
  selector: 'app-video-info-dialog',
  templateUrl: './video-info-dialog.component.html',
  styleUrls: ['./video-info-dialog.component.scss']
})
export class VideoInfoDialogComponent implements OnInit {
  file: DatabaseFile;
  new_file: DatabaseFile;
  window = window;
  upload_date: Date;
  category: Category;
  editing = false;
  initialized = false;
  retrieving_file = false;
  write_access = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public postsService: PostsService,
    private datePipe: DatePipe,
    private dataService: VideoInfoDataService,
    private stateService: VideoInfoStateService
  ) { }

  ngOnInit(): void {
    if (this.data) {
      this.initializeFile(this.data.file);
    }
    this.dataService.reloadCategories();
  }

  private initializeFile(file: DatabaseFile): void {
    const state = this.stateService.initializeState(file, this.postsService.user?.uid);
    this.file = state.file;
    this.new_file = state.new_file;
    this.upload_date = state.upload_date;
    this.category = state.category;
    this.write_access = state.write_access;
    this.initialized = state.initialized;
  }

  saveChanges(): void {
    const changes = this.stateService.getChanges(this.file, this.new_file);
    this.performUpdate(changes);
  }

  private performUpdate(changes: Partial<DatabaseFile>): void {
    this.retrieving_file = true;
    this.dataService.updateFile(this.file.uid, changes).subscribe(() => this.refreshFile());
  }

  private refreshFile(): void {
    this.dataService.getFile(this.file.uid).subscribe(
      res => {
        this.retrieving_file = false;
        this.initializeFile(res.file);
      },
      () => {
        this.retrieving_file = false;
      }
    );
  }

  uploadDateChanged(event: DateChangeEvent): void {
    this.new_file.upload_date = this.stateService.updateUploadDate(this.datePipe, event);
  }

  categoryChanged(event: SelectionChangeEvent): void {
    this.new_file.category = this.stateService.updateCategory(event.value);
  }

  metadataChanged(): boolean {
    return this.stateService.hasMetadataChanged(this.file, this.new_file);
  }

  toggleFavorite(): void {
    this.file.favorite = !this.file.favorite;
    this.performUpdate({ favorite: this.file.favorite });
  }
}
