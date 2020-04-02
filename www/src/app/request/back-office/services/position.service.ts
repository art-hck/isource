import {Injectable} from "@angular/core";
import {Uuid} from "../../../cart/models/uuid";
import {RequestPosition} from "../../common/models/request-position";
import {HttpClient} from "@angular/common/http";

@Injectable()
export class PositionService {

  constructor(
    protected api: HttpClient
  ) {
  }

  changePositionsStatus(positionIds: Uuid[], newStatus: string, role: string, reason?) {
    const url = `requests/${role}/positions/statuses/change`;
    return this.api.post<RequestPosition[]>(url, {
      positionIds: positionIds,
      status: newStatus,
      statusComment: reason
    });
  }
}
