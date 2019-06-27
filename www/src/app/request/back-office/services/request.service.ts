import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Uuid} from "../../../cart/models/uuid";

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

  changeStatus(id: Uuid, positionId: Uuid, status: string) {
    const url = `requests/backoffice/${id}/positions/${positionId}/change-status`;
    return this.api.post(url, {
      status: status
    });
  }
}
