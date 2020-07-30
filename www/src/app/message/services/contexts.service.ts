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
export class ContextsService {

  constructor(private ws: WsChatService) {}

  get(contextId?: number) {
    this.ws.send(`contexts.get`, { contextId });
  }

  create(serviceID: string, status: string, name: string, supervisorUid: string, items: [] ) {
    this.ws.send(`contexts.create`, { serviceID, status, name, supervisorUid, items });
  }

  setStatus(contextId: number, newStatus: string) {
    this.ws.send(`contexts.setStatus`, { contextId, newStatus });
  }

  setSupervisor(contextId: number, userId: number) {
    this.ws.send(`contexts.setSupervisor`, {contextId, userId});
  }

  merge(contexts: number[], newStatus: string, newName: string, newSupervisorUid: string) {
    this.ws.send(`contexts.merge`, { contexts, newStatus, newName, newSupervisorUid });
  }

  addItems(contextId: number, items: { id: number, data: string }[]) {
    this.ws.send(`contexts.addItems`, { contextId, items });
  }

  removeItems(contextId: number, items: number[]) {
    this.ws.send(`contexts.removeItems`, { contextId, items });
  }
}
