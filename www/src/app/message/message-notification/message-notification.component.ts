import { Component, OnInit } from '@angular/core';
import { WebsocketService } from "../../websocket/services/websocket.service";
import { WsTypes } from "../../websocket/enum/ws-types";
import { MessageNotification } from "../../request/common/models/message-notification";
import { Subscription, timer } from "rxjs";
import { MessageContextTypes } from "../message-context-types";
import { Router } from "@angular/router";

@Component({
  selector: 'app-message-notification',
  templateUrl: './message-notification.component.html',
  styleUrls: ['./message-notification.component.scss']
})
export class MessageNotificationComponent implements OnInit {

  open = false;
  message: MessageNotification;

  protected durations = 8000;

  private timerSubscription = new Subscription();

  constructor(
    private wsService: WebsocketService,
    public router: Router,
  ) {
  }

  ngOnInit() {
    this.initMessagesWebsocket();
  }

  initMessagesWebsocket() {
    // можно не отписываться, т.к. компонент создается только один раз и используется на всех страницах
    this.wsService.on<MessageNotification>(WsTypes.NEW_MESSAGE_EVENT).subscribe((message) => {
       // если уже находимся на нужной странице, то сообщение не показываем
      if (this.router.url === this.getChatUrl(message)) {
        return;
      }

      this.message = message;

      // устанавливаем таймер для автозакрытия всплывашки
      this.open = true;
      this.timerSubscription.unsubscribe();
      this.timerSubscription = timer(this.durations).subscribe(val => {
        this.open = false;
      });
    });
  }

  onContainerClick() {
    this.open = false;

    // todo не смог разобраться как поменять контекст, если уже находимся на странице чата
    // todo поэтому обновляем в этом случае всю страницу
    if (this.router.url.substr(0, 9) === '/messages') {
      window.location.href = this.getChatUrl(this.message);
    } else {
      this.router.navigateByUrl(this.getChatUrl(this.message));
    }
  }

  getChatUrl(message: MessageNotification): string {
    switch (message.contextType) {
      case MessageContextTypes.REQUEST: {
        return `/messages/request/${message.contextId}`;
      }
      case MessageContextTypes.REQUEST_GROUP: {
        return `/messages/request/${message.requestId}/group/${message.contextId}`;
      }
      case MessageContextTypes.REQUEST_POSITION: {
        return `/messages/request/${message.requestId}/position/${message.contextId}`;
      }
      default:
        console.error('Тип контекста сообщений не найден');
    }

    return 'messages';
  }

  getSubName() {
    return this.message.contragent ?
      this.message.contragent.shortName :
      'Бэк-офис';
  }
}
