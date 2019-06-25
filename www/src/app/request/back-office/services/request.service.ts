import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import {Uuid} from "../../../cart/models/uuid";
import {Observable} from "rxjs";


@Injectable()
export class RequestService {

  constructor(
    protected api: HttpClient,
  ) {
  }
  getRequestInfo(id: Uuid) {
    const url = `requests/backoffice/${id}/info`;
    return this.api.post(url, {});
  }

  getRequestPositions(id: Uuid) {
    const url = `requests/backoffice/${id}/positions`;
    return this.api.post(url, {});
  }
  }
