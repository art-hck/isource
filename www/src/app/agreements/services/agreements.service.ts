import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Agreements } from "../../dashboard/models/Agreements";
import { Observable } from "rxjs";

@Injectable()
export class AgreementsService {

  constructor(private api: HttpClient) {}

  getAgreements(startFrom: number = 1, pageSize: number = 10): Observable<Agreements> {
    const url = `requests/customer/agreements`;
    return this.api.post<Agreements>(url, {startFrom, pageSize});
  }
}
