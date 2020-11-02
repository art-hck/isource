import { Component, Input, OnInit } from "@angular/core";
import { NotificationInfo, NotificationItem } from "../../models/notifications";

@Component({
  selector: 'app-notification-card',
  templateUrl: './notification-card.component.html',
  styleUrls: ['./notification-card.component.scss']
})
export class NotificationCardComponent {
  @Input() notification: NotificationItem;

  get getLink() {
    return (this.notification?.body as NotificationInfo)?.rows?.length ?
      (this.notification?.body as NotificationInfo)?.rows[0].requestUrl?.replace(/https?\:\/\/.*?\//, '/') :
      (this.notification?.body as NotificationInfo)?.requestUrl?.replace(/https?\:\/\/.*?\//, '/');
}
}
