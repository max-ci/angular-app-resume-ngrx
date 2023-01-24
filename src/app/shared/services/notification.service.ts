import { Injectable } from '@angular/core';
import { Notification } from '../interfaces/notification.interface';
import { v4 as uuidv4 } from 'uuid';
import { Subject, Subscriber } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  notifications: Notification[] = [];
  notifications$: Subject<Notification[]> = new Subject();

  show(message: string, type: string = 'success'): void {
    const notificationId = uuidv4();
    const notification = {
      id: notificationId,
      message,
      type,
    };

    setTimeout(() => {
      this.hide(notificationId);
    }, 4000);

    this.notifications = [...this.notifications, notification];
    this.notifications$.next(this.notifications);
  }

  hide(notificationId: string): void {
    this.notifications = this.notifications.filter(
      (notification) => notification.id !== notificationId
    );
    this.notifications$.next(this.notifications);
  }
}
