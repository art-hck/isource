import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ContragentList } from "../models/contragent-list";
import { ContragentInfo } from "../models/contragent-info";
import { Uuid } from "../../cart/models/uuid";
import { saveAs } from 'file-saver/src/FileSaver';

@Injectable()
export class ContragentService {

  loading = false;

  constructor(
    protected api: HttpClient
  ) {
  }

  getContragentList(): Observable<ContragentList[]> {
    return this.api.post<ContragentList[]>(`/contragents`, {});
  }

  getContragentInfo(id: Uuid): Observable<ContragentInfo> {
    return this.api.get<ContragentInfo>(`contragents/${id}/info`);
  }

  downloadPrimaInformReport(contragent: ContragentInfo) {
    this.loading = true;
    this.api.post(
      `contragents/${contragent.id}/download-prima-inform-report`,
      {},
      {responseType: 'blob'})
      .subscribe(data => {
        saveAs(data, `PrimaInformReport${contragent.id}.pdf`);
        this.loading = false;
      }, (error: any) => {
        let msg = 'Ошибка при получении отчета';
        this.loading = false;
        if (error && error.error && error.error.detail) {
          msg = `${msg}: ${error.error.detail}`;
        }
        alert(msg);
      });
  }
}
