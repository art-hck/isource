import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { AgreementsResponse } from "../../common/models/agreements-response";
import { Observable } from "rxjs";

@Injectable()
export class AgreementsService {

  constructor(private api: HttpClient) {}

  getAgreements(startFrom: number = 0, pageSize: number = 20): Observable<AgreementsResponse> {
    const url = `requests/customer/agreements`;
    return this.api.post<AgreementsResponse>(url, {startFrom, pageSize});
  }

  getDashboardAgreements(): Observable<AgreementsResponse> {
    const url = `requests/customer/dashboard/agreements`;
    return this.api.post<AgreementsResponse>(url, null);
  }
}
