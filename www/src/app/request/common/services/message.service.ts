import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Message } from "../models/message";
import { RequestPosition } from "../models/request-position";

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(protected api: HttpClient) {
  }

  getList(requestPosition: RequestPosition): Observable<Message[]> {
    return this.api.get<Message[]>(`requests/positions/${requestPosition.id}/messages`);
  }

  addMessage(requestPosition: RequestPosition, message: string, files: File[]): Observable<Message> {
    const formData = new FormData();
    if (files) {
      files.forEach(file => {
        formData.append('files[]', file, file.name);
      });
    }
    formData.append('positionId', requestPosition.id);
    formData.append('message', message);

    return this.api.post<Message>(`requests/positions/${requestPosition.id}/messages/create`, formData);
  }
}
