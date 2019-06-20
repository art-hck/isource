import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {RequestItem} from "../models/request-item";


@Injectable()
export class CreateRequestService {

  constructor(
    protected api: HttpClient
  ) {
  }

  addRequest(requestItem: RequestItem) {
    return this.api.post(
      `requests/customer/add-request`,
      {
        positions: [
          requestItem
        ]
      })
  }
}
