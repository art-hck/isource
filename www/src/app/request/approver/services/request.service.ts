import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Uuid } from "../../../cart/models/uuid";
import { Observable, of } from "rxjs";
import { Request } from "../../common/models/request";
import { Page } from "../../../core/models/page";
import { RequestsList } from "../../common/models/requests-list/requests-list";
import { RequestsListFilter } from "../../common/models/requests-list/requests-list-filter";
import { RequestsListSort } from "../../common/models/requests-list/requests-list-sort";
import { AvailableFilters } from "../../common/models/requests-list/available-filters";


@Injectable({
  providedIn: "root"
})
export class RequestService {

  constructor(protected api: HttpClient) {}

  get(id: Uuid) {
    return of<Request>(null);
  }

  list(startFrom: number, pageSize: number, filters: RequestsListFilter, sort: RequestsListSort): Observable<Page<RequestsList>> {
    const url = `requests/customer/list`;
    return this.api.post<Page<RequestsList>>(url, { startFrom, pageSize, filters, sort });
  }

  availableFilters() {
    const url = `requests/customer/available-filters`;
    return this.api.get<AvailableFilters>(url);
  }

  approve(requestIds: Uuid[]) {
    const url = `requests/customer/approve`;
    return this.api.post(url, { requestIds });
  }

  reject(requestIds: Uuid[]) {
    const url = `requests/customer/reject`;
    return this.api.post(url, { requestIds });
  }
}
