import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {Observable} from "rxjs";
import {RequestsList} from "../models/requests-list";


@Injectable()
export class GetRequestsService {

  constructor(
    protected api: HttpClient
  ) {
  }

  /**
   * @param role
   */
  getRequestsList(role): Observable<RequestsList[]> {
    return this.api.post<RequestsList[]>(`requests/${role}/list`, {});
  }

}
