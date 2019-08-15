import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { History } from "../models/history";
import { RequestPosition } from "../models/request-position";
import { saveAs } from 'file-saver/src/FileSaver';

@Injectable({
  providedIn: 'root'
})
export class RequestPositionHistoryService {

  constructor(protected api: HttpClient) {
  }

  getHistory(requestPosition: RequestPosition): Observable<History[]> {
    return this.api.get<History[]>(`requests/positions/${requestPosition.id}/history`);
  }

  downloadFileFromHistory(documentId, documentName) {
    this.api.post(
      `requests/documents/${documentId}/download`,
      {},
      {responseType: 'blob'})
      .subscribe(data => {
        saveAs(data, documentName);
      });
  }

}
