import { Injectable } from '@angular/core';
import { PostsService } from 'app/posts.services';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private postsService: PostsService) { }

  showSuccessMessage(message: string): void {
    this.postsService.openSnackBar(message);
  }

  showErrorMessage(message: string, error?: unknown): void {
    this.postsService.openSnackBar(message);
    if (error) {
      console.error(error);
    }
  }

  showConditionalMessage(success: boolean, successMsg: string, failMsg: string): void {
    const message = success ? successMsg : failMsg;
    this.postsService.openSnackBar(message);
  }
}
