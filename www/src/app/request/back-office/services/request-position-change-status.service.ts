import { Injectable } from "@angular/core";
import { Uuid } from "../../../cart/models/uuid";
import { RequestPosition } from "../../common/models/request-position";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class RequestPositionChangeStatusService {

  constructor(
    protected api: HttpClient
  ) {
  }

  changePositionsStatus(positionIds: Array<Uuid>, newStatus: string) {
    const url = `requests/backoffice/positions/statuses/change`;
    return this.api.post<RequestPosition[]>(url, {
      positionIds: positionIds,
      status: newStatus
    });
  }
}
