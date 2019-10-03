import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Uuid } from "../../cart/models/uuid";
import { Message } from "../message";
import { Page } from "../../core/models/page";
import { RequestsList } from "../../request/common/models/requests-list/requests-list";
import { RequestPositionList } from "../../request/common/models/request-position-list";
import { map } from "rxjs/operators";
import { RequestGroup } from "../../request/common/models/request-group";
import { RequestPosition } from "../../request/common/models/request-position";


@Injectable()
export class MessageService {

  constructor(protected api: HttpClient) {
  }

  getList(contextType: string, contextId: Uuid): Observable<Message[]> {
    return this.api.get<Message[]>(`messages/${contextType}/${contextId}`);
  }

  addMessage(message: string, contextType: string, contextId: Uuid, files: File[]): Observable<Message> {
    const formData = new FormData();
    if (files) {
      files.forEach(file => {
        formData.append('files[]', file, file.name);
      });
    }
    formData.append('contextType', contextType);
    formData.append('contextId', contextId);
    formData.append('message', message);

    return this.api.post<Message>(`messages/create`, formData);
  }

  /**
   *  // todo методы получения информации по заявке продублированы из модуля заявок. Не хочется делать зависимость
   * @param role
   * @param startFrom
   * @param pageSize
   * @param filters
   * @param sort
   */
  getRequests(role, startFrom, pageSize, filters, sort): Observable<Page<RequestsList>> {
    return this.api.post<Page<RequestsList>>(`requests/${role}/list`, {
      startFrom: startFrom,
      pageSize: pageSize,
      filters: filters,
      sort: sort,
    });
  }

  getRequestPositions(id: Uuid): Observable<RequestPositionList[]> {
    const url = `requests/customer/${id}/positions`;
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
