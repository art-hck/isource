import { Component, OnInit } from '@angular/core';
import { WebsocketService } from "../../websocket/services/websocket.service";
import { Subscription, timer } from "rxjs";
import { Router } from "@angular/router";
import { MessagesService } from "../services/messages.service";
import { UserInfoService } from "../../user/service/user-info.service";
import { Message } from "../models/message";

@Component({
  selector: 'app-message-notification',
  templateUrl: './message-notification.component.html',
  styleUrls: ['./message-notification.component.scss']
})
export class MessageNotificationComponent implements OnInit {

  open = false;
  message: Message;

  protected durations = 10000;

  private timerSubscription = new Subscription();

  constructor(
    private wsService: WebsocketService,
    private messagesService: MessagesService,
    private user: UserInfoService,
    public router: Router,
  ) {
  }

  ngOnInit() {
    this.initMessagesWebsocket();
  }

  initMessagesWebsocket() {
    // можно не отписываться, т.к. компонент создается только один раз и используется на всех страницах
    this.messagesService.onNew().subscribe((message) => {
      // самому себе сообщения не показываем
      if (message.author.uid === this.user.getUserInfo().id) {
        return;
      }

      // если уже находимся на нужной странице, то сообщение не показываем
      if (this.messagesService.curConversationId !== null
        && message.conversation.id === this.messagesService.curConversationId
      ) {
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

    if (this.router.url.substr(0, 9) !== '/messages') {
      this.router.navigateByUrl('/messages');
    }
  }
}
