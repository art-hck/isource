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
export class UsersService {

  constructor(private ws: WsChatService) {}

  get(userId: number, limit: number = 50, offset: number = 0) {
    this.ws.send(`users.get`, { userId, limit, offset });
  }

  getSelf() {
    this.ws.send(`users.getself`);
  }
}
