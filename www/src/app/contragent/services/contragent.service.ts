import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ContragentList } from "../models/contragent-list";
import { ContragentInfo } from "../models/contragent-info";
import { Uuid } from "../../cart/models/uuid";

@Injectable()
export class ContragentService {

  constructor(
    protected api: HttpClient
  ) {
  }

  getContragentList(): Observable<ContragentList[]> {
    return this.api.post<ContragentList[]>(`/contragents`, {});
  }

  getContragentInfo(id: Uuid): Observable<ContragentInfo> {
    return this.api.post<ContragentInfo>(`/contragents/${id}/info`, {});
  }
}
