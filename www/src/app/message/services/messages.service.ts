import { Injectable } from '@angular/core';
import { filter, map } from "rxjs/operators";
import { WsChatTypes } from "../../websocket/enum/ws-chat-types";
import { WsChatService } from "../../websocket/services/ws-chat.service";
import { Message } from "../models/message";
import { Uuid } from "../../cart/models/uuid";
import { Observable } from "rxjs";
import { Page } from "../../core/models/page";
import { RequestsList } from "../../request/common/models/requests-list/requests-list";
import { RequestPositionList } from "../../request/common/models/request-position-list";
import { RequestGroup } from "../../request/common/models/request-group";
import { RequestPosition } from "../../request/common/models/request-position";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  constructor(private ws: WsChatService, protected api: HttpClient) {}

  get(conversationId: number, messageId?: number, limit: number = 50, offset: number = 0) {
    return this.ws.send<Message[]>(`messages.get`, { conversationId, messageId, limit, offset });
  }

  send(text: string, conversationId: number, attachments?: number[]) {
    return this.ws.send(`messages.send`, { text, conversationId, attachments });
  }

  unreadCount() {
    return this.ws.send<{ count: number }>(`messages.unreadcount`);
  }

  markSeen(data: { conversationId?: number, messageId?: number }) {
    return this.ws.send(`messages.markseen`, data);
  }

  onNew(conversationId?: number) {
    return this.ws.on<Message>(WsChatTypes.MESSAGES_NEW)
      .pipe(filter(({ conversation: { id } }) => conversationId ? id === conversationId : true));
  }

  onMarkSeen() {
    return this.ws.on(WsChatTypes.MESSAGES_MARKSEEN);
  }

  /**
   *  @TODO: методы получения информации по заявке продублированы из модуля заявок. Не хочется делать зависимость
   */
  getRequests(role, startFrom, pageSize, filters, sort): Observable<Page<RequestsList>> {
    return this.api.post<Page<RequestsList>>(`requests/${role}/list`, { startFrom, pageSize, filters, sort });
  }

  getRequestItems(id: Uuid, role): Observable<RequestPositionList[]> {
    const url = `requests/${role}/${id}/positions`;
    return this.api.post<RequestPositionList[]>(url, {}).pipe(
      map((data: RequestPositionList[]) => {
        return data.map(function recursiveMapPositionList(item: RequestPositionList) {
          switch (item.entityType) {
            case 'GROUP':
              const group = new RequestGroup(item);
              group.positions = group.positions.map(recursiveMapPositionList);

              return group;
            case 'POSITION':
              return new RequestPosition(item);
          }
        });
      })
    );
  }
}
