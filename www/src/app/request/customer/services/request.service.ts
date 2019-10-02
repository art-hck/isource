import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Uuid } from "../../../cart/models/uuid";
import { RequestPosition } from "../../common/models/request-position";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { RequestPositionList } from "../../common/models/request-position-list";
import { RequestGroup } from "../../common/models/request-group";
import { Request } from "../../common/models/request";
import { RequestDocument } from "../../common/models/request-document";

@Injectable()
export class RequestService {

  constructor(
    protected api: HttpClient,
  ) {
  }

  getRequestInfo(id: Uuid) {
    const url = `requests/customer/${id}/info`;
    return this.api.post(url, {}).pipe(
      map((data: Request) => {
        return new Request(data);
      })
    );
  }

  getRequestPositions(id: Uuid): Observable<RequestPositionList[]> {
    const url = `requests/customer/${id}/positions`;
    return this.api.post<RequestPositionList[]>(url, {}).pipe(
      map((data: RequestPositionList[]) => {
        return data.map((item: RequestPositionList) => {
          switch (item.entityType) {
            case 'GROUP':
              return new RequestGroup(item);
            case 'POSITION':
              return new RequestPosition(item);
          }
        });
      })
    );
  }

  getRequestPositionsWithOffers(id: Uuid): Observable<any> {
    const url = `requests/customer/${id}/positions-with-offers`;
    return this.api.get<any>(url);
  }

  publishRequest(id: Uuid) {
    const url = `requests/customer/${id}/publish`;
    return this.api.post(url, {});
  }

  approveRequest(id: Uuid) {
    const url = `requests/customer/${id}/approve`;
    return this.api.post(url, {});
  }

  rejectRequest(id: Uuid, rejectionMessage: string) {
    const url = `requests/customer/${id}/reject`;
    return this.api.post(url, {rejectionMessage});
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
