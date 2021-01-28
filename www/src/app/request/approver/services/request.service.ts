import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Uuid } from "../../../cart/models/uuid";
import { Observable, of } from "rxjs";
import { Request } from "../../common/models/request";
import { Page } from "../../../core/models/page";
import { RequestsList } from "../../common/models/requests-list/requests-list";


@Injectable({
  providedIn: "root"
})
export class RequestService {

  constructor(protected api: HttpClient) {}

  get(id: Uuid) {
    return of<Request>(null);
  }

  list(startFrom, pageSize, filters, sort): Observable<Page<RequestsList>> {
    const url = `requests/customer/list`;
    return this.api.post<Page<RequestsList>>(url, { startFrom, pageSize, filters, sort });
  }
}
