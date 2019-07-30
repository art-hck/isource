import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Uuid} from "../../../cart/models/uuid";
import { RequestPosition } from "../../common/models/request-position";
import { Observable } from "rxjs";
import { RequestDocument } from "../../common/models/request-document";

@Injectable()
export class RequestService {

  constructor(
    protected api: HttpClient,
  ) {
  }

  getRequestInfo(id: Uuid) {
    const url = `requests/customer/${id}/info`;
    return this.api.post(url, {});
  }

  getRequestPositions(id: Uuid): Observable<RequestPosition[]> {
    const url = `requests/customer/${id}/positions`;
    return this.api.post<RequestPosition[]>(url, {});
  }

  choiceWinner(offerWinnerId: Uuid, positionId: Uuid, id: Uuid) {
    const url = `requests/customer/${id}/positions/${positionId}/choose-winner`;
    return this.api.post(url, {
      requestOfferPositionId: offerWinnerId
    });
  }

  uploadDocuments(requestPosition: RequestPosition, files: File[]): Observable<RequestDocument[]> {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files[]', file, file.name);
    });

    return this.api.post<RequestDocument[]>(
      `requests/customer/${requestPosition.requestId}/positions/${requestPosition.id}/documents/upload`,
      formData
    );
  }
}
