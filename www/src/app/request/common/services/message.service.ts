import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Message } from "../models/message";
import { Uuid } from "../../../cart/models/uuid";

@Injectable({
  providedIn: 'root'
})
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
}
