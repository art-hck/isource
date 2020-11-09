import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from "@angular/core";
import { NotificationInfo, NotificationItem } from "../../models/notifications";

@Component({
  selector: 'app-notification-card',
  templateUrl: './notification-card.component.html',
  styleUrls: ['./notification-card.component.scss']
})
export class NotificationCardComponent implements OnInit {

  @Input() notification: NotificationItem;
  @Input() view: 'popup' | 'list';
  @Output() hideNotification = new EventEmitter<NotificationItem>();

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

    switch (positionStatus) {
      case "PROPOSALS_PREPARATION":
        return 'Осуществляется подготовка предложений по позиции';
      case "RESULTS_AGREEMENT":
        return 'Подготовлены предложения поставщиков по позиции';
      case "WINNER_SELECTED":
        return 'Выбран победитель по позиции';
      case "TCP_WINNER_SELECTED":
        return 'Выбран победитель по позиции';
      case "CONTRACT_AGREEMENT":
        return 'Осуществляется согласование договора с поставщиком';
      case "CONTRACT_SIGNING":
        return 'Согласован и ожидает подписания договор с победителем';
      case "CONTRACTED":
        return 'Сторонами подписан договор по позиции';
      case "COMPLETED":
        return 'Выполнен заказ по позиции';
      default:
        return 'Изменен статус позиции на ' + positionStatusLabel;
    }
  }

  onHideNotification(event, notification) {
    event.preventDefault();
    event.stopPropagation();

    this.hideNotification.emit(notification);
  }

  hideOnTimeout() {
    setTimeout(() => { this.hideNotification.emit(this.notification); }, 5000);
  }

}
