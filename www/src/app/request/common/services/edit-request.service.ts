import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import { Observable } from 'rxjs';
import {Uuid} from "../../../cart/models/uuid";
import { RequestPosition } from "../models/request-position";


@Injectable()
export class EditRequestService {

  constructor(
    protected api: HttpClient
  ) {
  }

  updateRequestPosition(positionId: Uuid, requestItem: any): Observable<RequestPosition> {
    return this.api.post<RequestPosition>(
      `requests/positions/${positionId}/edit`, requestItem);
  }

}
