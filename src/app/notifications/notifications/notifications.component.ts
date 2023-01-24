import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Notification } from 'src/app/common/interfaces/notification.interface';
import { NotificationService } from 'src/app/common/services/notification.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationsComponent {
  notifications$: Observable<Notification[]>;

  constructor(private _notificationService: NotificationService) {
    this.notifications$ = this._notificationService.notifications$;
  }

  hide(id: string): void {
    this._notificationService.hide(id);
  }
}
