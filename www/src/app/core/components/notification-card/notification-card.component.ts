import {
  Component,
  EventEmitter,
  Input,
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
export class NotificationCardComponent {

  @Input() notification: NotificationItem;
  @Input() view: 'popup' | 'list';
  @Output() hideNotification = new EventEmitter<NotificationItem>();
  @Output() readNotification = new EventEmitter<NotificationItem>();

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

  formatDate(date): string {
    return moment(date).locale("ru").format("D MMM, HH:mm");
  }

  markNotificationAsRead() {
    this.readNotification.emit(this.notification);
  }

}
