import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PostsService } from 'app/posts.services';
import { DatabaseFile } from 'api-types';

@Injectable({
  providedIn: 'root'
})
export class VideoInfoDataService {
  constructor(private postsService: PostsService) { }

  getFile(fileId: string): Observable<{ file: DatabaseFile }> {
    return this.postsService.getFile(fileId);
  }

  updateFile(fileId: string, changes: Partial<DatabaseFile>): Observable<any> {
    return this.postsService.updateFile(fileId, changes);
  }

  reloadCategories(): void {
    this.postsService.reloadCategories();
  }

  getCategories() {
    return this.postsService.categories;
  }
}
