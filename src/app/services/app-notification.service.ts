import { Injectable } from '@angular/core';
import { NotificationsComponent } from '../components/notifications/notifications.component';

@Injectable({
  providedIn: 'root'
})
export class AppNotificationService {
  private notificationsComponent: NotificationsComponent;
  notificationCount = 0;

  setNotificationsComponent(component: NotificationsComponent): void {
    this.notificationsComponent = component;
  }

  updateNotificationCount(count: number): void {
    this.notificationCount = count;
  }

  openNotificationMenu(): void {
    if (this.notificationsComponent) {
      this.notificationsComponent.getNotifications();
    }
  }

  closeNotificationMenu(): void {
    if (this.notificationsComponent) {
      this.notificationsComponent.setNotificationsToRead();
    }
  }
}
