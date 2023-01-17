import { Injectable } from '@angular/core';
import { Notification } from '../interfaces/notification';
import { v4 as uuidv4 } from 'uuid';
import { Observable, Subscriber } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  notificationsSubscriber$: Subscriber<Notification[]>;
  notifications: Notification[] = [];
  notifications$: Observable<Notification[]> = new Observable((subscriber) => {
    this.notificationsSubscriber$ = subscriber;
  });

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
    this.notificationsSubscriber$.next(this.notifications);
  }

  hide(notificationId: string): void {
    this.notifications = this.notifications.filter(
      (notification) => notification.id !== notificationId
    );
    this.notificationsSubscriber$.next(this.notifications);
  }
}
