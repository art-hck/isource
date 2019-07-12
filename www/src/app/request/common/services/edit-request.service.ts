import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import { Observable } from 'rxjs';
import {Uuid} from "../../../cart/models/uuid";


@Injectable()
export class EditRequestService {

  constructor(
    protected api: HttpClient
  ) {
  }

  saveRequest(positionId: Uuid, requestItem: any) {
    return this.api.post(
      `requests/positions/${positionId}/edit`, requestItem);
  }

}
