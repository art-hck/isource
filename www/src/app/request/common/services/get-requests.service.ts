import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {Observable} from "rxjs";
import { Page } from "../../../core/models/page";
import { RequestsList } from "../models/requests-list/requests-list";


@Injectable()
export class GetRequestsService {

  constructor(
    protected api: HttpClient
  ) {
  }

  /**
   * @param role
   * @param startFrom
   * @param pageSize
   * @param filters
   * @param sort
   */
  getRequests(role, startFrom, pageSize, filters): Observable<Page<RequestsList>> {
    return this.api.post<Page<RequestsList>>(`requests/${role}/list`, {
      startFrom: startFrom,
      pageSize: pageSize,
      filters: filters,
      // sort: sort,
    });
  }

}
