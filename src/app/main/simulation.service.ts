import { Injectable } from '@angular/core';
import { DownloadOrchestrator } from './download-orchestrator.service';
import { PostsService } from '../posts.services';

@Injectable({
  providedIn: 'root'
})
export class SimulationService {
  
  constructor(
    private downloadOrchestrator: DownloadOrchestrator,
    private postsService: PostsService
  ) {}

  generateAndFormatOutput(
    url: string, 
    youtubePassword: string | null,
    onSuccess: (output: string) => void
  ): void {
    this.downloadOrchestrator.generateSimulatedOutput(url, youtubePassword)
      ?.subscribe(res => {
        const simulated_args = res['args'];
        if (simulated_args) {
          this.maskPassword(simulated_args);
          const downloader = this.postsService.config.Advanced.default_downloader;
          const output = `${downloader} ${url} ${simulated_args.join(' ')}`;
          onSuccess(output);
        }
      });
  }

  private maskPassword(args: string[]): void {
    const passwordIndex = args.indexOf('--password');
    if (passwordIndex !== -1 && passwordIndex !== args.length - 1) {
      args[passwordIndex + 1] = args[passwordIndex + 1].replace(/./g, '*');
    }
  }
}
