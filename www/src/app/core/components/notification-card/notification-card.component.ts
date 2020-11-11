import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from "@angular/core";
import { NotificationInfo, NotificationItem } from "../../models/notifications";
import { NotificationTypeTitles } from "../../../request/common/dictionaries/notification-type-titles";
import * as moment from "moment";

@Component({
  selector: 'app-notification-card',
  templateUrl: './notification-card.component.html',
  styleUrls: ['./notification-card.component.scss']
})
export class NotificationCardComponent implements OnInit {

  @Input() notification: NotificationItem;
  @Input() view: 'popup' | 'list';
  @Output() hideNotification = new EventEmitter<NotificationItem>();
  @Output() readNotification = new EventEmitter<NotificationItem>();

  ngOnInit() {
    if (this.view === 'popup') {
     this.hideOnTimeout();
    }
  }

  getLink(notification) {
    return (notification?.body as NotificationInfo)?.rows?.length ?
      (notification?.body as NotificationInfo)?.rows[0].requestUrl?.replace(/https?\:\/\/.*?\//, '/') :
      (notification?.body as NotificationInfo)?.requestUrl?.replace(/https?\:\/\/.*?\//, '/');
  }

  getNotificationHeaderTitle(item): string {
    const positionStatus = item?.requestPositionStatus;
    const positionStatusLabel = item?.requestPositionStatusLabel;

    return NotificationTypeTitles[positionStatus] || 'Изменен статус позиции на ' + positionStatusLabel;
  }

  onHideNotification(event, notification) {
    event.preventDefault();
    event.stopPropagation();

    this.hideNotification.emit(notification);
  }

  // todo Реализовать скрытие уведомлений через RXJS (pipe(debounceTime(5000), mapTo(null)))
  hideOnTimeout() {
    setTimeout(() => { this.hideNotification.emit(this.notification); }, 5000);
  }

  formatDate(date): string {
    return moment(date).locale("ru").format("D MMM, HH:mm");
  }

  markNotificationAsRead() {
    this.readNotification.emit(this.notification);
  }

}
