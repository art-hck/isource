import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ContragentList } from "../models/contragent-list";
import { ContragentInfo } from "../models/contragent-info";
import { Uuid } from "../../cart/models/uuid";
import { saveAs } from 'file-saver/src/FileSaver';
import { ContragentShortInfo } from "../models/contragent-short-info";
import { ContragentRegistrationRequest } from "../models/contragent-registration-request";

@Injectable()
export class ContragentService {

  loading = false;

  constructor(
    protected api: HttpClient
  ) {
  }

  getContragentList(): Observable<ContragentList[]> {
    return this.api.post<ContragentList[]>(`contragents`, {});
  }

  getCustomersList(): Observable<ContragentList[]> {
    return this.api.post<ContragentList[]>(`customers`, {});
  }

  getContragentInfo(id: Uuid): Observable<ContragentInfo> {
    return this.api.get<ContragentInfo>(`contragents/${id}/info`);
  }

  downloadPrimaInformReport(contragentId: Uuid) {
    this.loading = true;
    this.api.post(
      `contragents/${contragentId}/download-prima-inform-report`,
      {},
      {responseType: 'blob'})
      .subscribe(data => {
        saveAs(data, `PrimaInformReport${contragentId}.pdf`);
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

  contragentExists(inn: string, kpp: string): Observable<ContragentShortInfo> {
    return this.api.post<ContragentShortInfo>('contragents/check-exists', { inn: inn, kpp: kpp });
  }

  registration(body: ContragentRegistrationRequest) {
    return this.api.post<ContragentShortInfo>("contragents/registration", body);
  }

  editContragent(body: ContragentRegistrationRequest) {
    return this.api.post<ContragentShortInfo>("contragents/edit", body);
  }
}
