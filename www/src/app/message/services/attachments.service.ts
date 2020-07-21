import { Inject, Injectable } from '@angular/core';
import { filter, map } from "rxjs/operators";
import { IWebsocketService } from "../../websocket/websocket.interfaces";
import { WebSocketSubject } from "rxjs/webSocket";
import { WsChatTypes } from "../../websocket/enum/ws-chat-types";
import { WsChatMessage } from "../../websocket/models/ws-chat-message";
import { WsConfig } from "../../websocket/models/ws-config";
import { config } from "../../websocket/services/ws-config-token";
import { WsChatService } from "../../websocket/services/ws-chat.service";

@Injectable({
  providedIn: 'root'
})
export class AttachmentsService {

  constructor(private ws: WsChatService) {}

  cancel(attachmentId: number) {
    this.ws.send(`attachments.cancel`, { attachmentId });
  }

  // @TODO: доработать (загрузка по вебсокетам невозможна!)
  upload() {
    this.ws.send<number>(`attachments.upload`);
  }

  file(id) {
    this.ws.send(`attachments.file.${id}`);
  }
}
