import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import { Observable } from 'rxjs';
import {Uuid} from "../../../cart/models/uuid";
import { RequestPosition } from "../models/request-position";

@Injectable()
export class RequestPositionDraftService {

  constructor(
    protected api: HttpClient
  ) {
  }

  deleteRequestPositionDraft(draftId: Uuid): Observable<RequestPosition> {
    return this.api.post<RequestPosition>(
      `requests/position-drafts/${draftId}/delete`, {});
  }
}
