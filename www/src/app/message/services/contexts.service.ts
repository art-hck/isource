import { Injectable } from '@angular/core';
import { WsChatService } from "../../websocket/services/ws-chat.service";
import { Context } from "../models/context";

@Injectable({
  providedIn: 'root'
})
export class ContextsService {

  constructor(private ws: WsChatService) {}

  get(contextIds?: number[]) {
    return this.ws.send<Context[]>(`contexts.get`, { contextIds });
  }

  create(serviceID: string, status: string, name: string, supervisorUid: string, items: [] ) {
    return this.ws.send(`contexts.create`, { serviceID, status, name, supervisorUid, items });
  }

  setStatus(contextId: number, newStatus: string) {
    return this.ws.send(`contexts.setStatus`, { contextId, newStatus });
  }

  setSupervisor(contextId: number, userId: number) {
    return this.ws.send(`contexts.setSupervisor`, {contextId, userId});
  }

  merge(contexts: number[], newStatus: string, newName: string, newSupervisorUid: string) {
    return this.ws.send(`contexts.merge`, { contexts, newStatus, newName, newSupervisorUid });
  }

  addItems(contextId: number, items: { id: number, data: string }[]) {
    return this.ws.send(`contexts.addItems`, { contextId, items });
  }

  removeItems(contextId: number, items: number[]) {
    return this.ws.send(`contexts.removeItems`, { contextId, items });
  }
}
