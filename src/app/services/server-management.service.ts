import { Injectable } from '@angular/core';
import { PostsService } from '../posts.services';

type GitHubRelease = Record<string, any>;

@Injectable({
  providedIn: 'root'
})
export class ServerManagementService {
  private latestGithubRelease: GitHubRelease | null = null;

  constructor(private postsService: PostsService) {}

  getLatestGithubRelease(): void {
    this.postsService.getLatestGithubRelease().subscribe(res => {
      this.latestGithubRelease = res;
    });
  }

  getRelease(): GitHubRelease | null {
    return this.latestGithubRelease;
  }

  restartServer(): void {
    this.postsService.restartServer().subscribe(() => {
      this.postsService.openSnackBar($localize`Restarting!`);
    }, () => {
      this.postsService.openSnackBar($localize`Failed to restart the server.`);
    });
  }
}
