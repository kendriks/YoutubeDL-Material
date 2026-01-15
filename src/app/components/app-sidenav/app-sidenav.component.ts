import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { PostsService } from '../posts.services';

@Component({
  selector: 'app-sidenav',
  templateUrl: './app-sidenav.component.html',
  styleUrls: ['./app-sidenav.component.css']
})
export class AppSidenavComponent implements OnInit {
  @ViewChild('sidenav') sidenav: MatSidenav;
  @Input() allowSubscriptions: boolean;

  constructor(public postsService: PostsService) {}

  ngOnInit(): void {}

  closeSidenav(): void {
    if (this.postsService.sidepanel_mode === 'over') {
      this.sidenav.close();
    }
  }

  getSidenavMode(): void {
    return this.postsService.sidepanel_mode;
  }

  isSidenavOpen(): boolean {
    return this.postsService.sidepanel_mode === 'side';
  }
}
