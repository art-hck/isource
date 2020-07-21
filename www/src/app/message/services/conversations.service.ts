import { Inject, Injectable } from '@angular/core';
import { filter, map } from "rxjs/operators";
import { IWebsocketService } from "../../websocket/websocket.interfaces";
import { WebSocketSubject } from "rxjs/webSocket";
import { WsChatTypes } from "../../websocket/enum/ws-chat-types";
import { WsChatMessage } from "../../websocket/models/ws-chat-message";
import { WsConfig } from "../../websocket/models/ws-config";
import { config } from "../../websocket/services/ws-config-token";
import { WsChatService } from "../../websocket/services/ws-chat.service";
import { Uuid } from "../../cart/models/uuid";

@Injectable({
  providedIn: 'root'
})
export class ConversationsService {

  constructor(private ws: WsChatService) {}

  get(conversationId?: number) {
    this.ws.send(`conversations.get`, { conversationId });
  }

  create(topic: string, participants: Uuid[], contextId: number) {
    this.ws.send(`conversations.create`, { topic, participants, contextId });
  }

  addParticipants(newParticipants: Uuid[], conversationId: number) {
    this.ws.send(`conversations.addParticipants`, { newParticipants, conversationId });
  }

  removeParticipants(participantsToRemove: Uuid[], conversationId: number) {
    this.ws.send(`conversations.removeParticipants`, { participantsToRemove, conversationId });
  }

  unreadCount(conversationId?: number) {
    this.ws.send(`conversations.unreadcount`, { conversationId });
  }
}
