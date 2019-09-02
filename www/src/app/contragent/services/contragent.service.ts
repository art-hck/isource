import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ContragentList } from "../models/contragent-list";

@Injectable()
export class ContragentService {

  constructor(
    protected api: HttpClient
  ) {
  }

  getContragentList(): Observable<ContragentList[]> {
    return this.api.post<ContragentList[]>(`/contragents`, {});
  }
}
