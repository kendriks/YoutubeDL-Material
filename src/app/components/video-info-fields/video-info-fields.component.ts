import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { DatabaseFile, Category } from 'api-types';
import { DatePipe } from '@angular/common';
import { PostsService } from 'app/posts.services';

interface DateChangeEvent {
  value: Date;
}

interface SelectionChangeEvent {
  value: Category;
}

@Component({
  selector: 'app-video-info-fields',
  template: `
    <mat-form-field class="info-field">
      <mat-label i18n="Name">Name</mat-label>
      <input [(ngModel)]="file.title" matInput [disabled]="!editing">
    </mat-form-field>
    <mat-form-field class="info-field">
      <mat-label i18n="URL">URL</mat-label>
      <input [(ngModel)]="file.url" matInput [disabled]="!editing">
      <button mat-icon-button matSuffix (click)="window.open(file.url, '_blank')">
        <mat-icon>link</mat-icon>
      </button>
    </mat-form-field>
    <mat-form-field class="info-field">
      <mat-label i18n="Uploader">Uploader</mat-label>
      <input [(ngModel)]="file.uploader" matInput [disabled]="!editing">
    </mat-form-field>
    <mat-form-field class="info-field">
      <mat-label i18n="Upload date">Upload date</mat-label>
      <input [value]="uploadDate" matInput [matDatepicker]="picker" (dateChange)="dateChanged.emit($event)" [disabled]="!editing">
      <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
      <mat-datepicker #picker></mat-datepicker>
    </mat-form-field>
    <mat-form-field class="info-field">
      <mat-label i18n="Thumbnail path">Thumbnail path</mat-label>
      <input [(ngModel)]="file.thumbnailPath" matInput [disabled]="!editing">
    </mat-form-field>
    <mat-form-field class="info-field">
      <mat-label i18n="Thumbnail URL">Thumbnail URL</mat-label>
      <input [(ngModel)]="file.thumbnailURL" matInput [disabled]="!editing || file.thumbnailPath">
    </mat-form-field>
    <mat-form-field *ngIf="initialized && postsService.categories" class="info-field">
      <mat-label i18n="Category">Category</mat-label>
      <mat-select [value]="category" (selectionChange)="categoryChanged.emit($event)" [compareWith]="categoryComparison" [disabled]="!editing">
        <mat-option [value]="{}">N/A</mat-option>
        <mat-option *ngFor="let cat of postsService.categories | keyvalue" [value]="cat.value">
          {{cat.value['name']}}
        </mat-option>
      </mat-select>
    </mat-form-field>
    <mat-form-field class="info-field">
      <mat-label i18n="View count">View count</mat-label>
      <input type="number" [(ngModel)]="file.view_count" matInput [disabled]="!editing">
    </mat-form-field>
    <mat-form-field class="info-field">
      <mat-label i18n="Local view count">Local view count</mat-label>
      <input type="number" [(ngModel)]="file.local_view_count" matInput [disabled]="!editing">
    </mat-form-field>
  `
})
export class VideoInfoFieldsComponent implements OnInit {
  @Input() file: DatabaseFile;
  @Input() uploadDate: Date;
  @Input() category: Category;
  @Input() editing = false;
  @Input() initialized = false;
  @Output() dateChanged = new EventEmitter<DateChangeEvent>();
  @Output() categoryChanged = new EventEmitter<SelectionChangeEvent>();
  
  window = window;

  constructor(public postsService: PostsService) { }

  ngOnInit(): void { }

  categoryComparison(opt: Category, val: Category): boolean {
    if (!opt && !val) return true;
    else if (!opt || !val) return false;
    return opt.uid === val.uid;
  }
}
