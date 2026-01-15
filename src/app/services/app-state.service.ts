import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppStateService {
  private topBarTitleSubject = new BehaviorSubject<string>('Youtube Downloader');
  public topBarTitle$ = this.topBarTitleSubject.asObservable();

  private notificationCountSubject = new BehaviorSubject<number>(0);
  public notificationCount$ = this.notificationCountSubject.asObservable();

  constructor() {}

  setTopBarTitle(title: string): void {
    this.topBarTitleSubject.next(title);
  }

  updateNotificationCount(count: number): void {
    this.notificationCountSubject.next(count);
  }

  getTopBarTitle(): string {
    return this.topBarTitleSubject.getValue();
  }

  getNotificationCount(): number {
    return this.notificationCountSubject.getValue();
  }
}
