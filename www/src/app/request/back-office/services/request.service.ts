import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Uuid } from "../../../cart/models/uuid";
import { Observable } from "rxjs";
import { RequestPosition } from "../../common/models/request-position";
import { map } from "rxjs/operators";
import { RequestPositionList } from "../../common/models/request-position-list";
import { RequestGroup } from "../../common/models/request-group";
import { Request } from "../../common/models/request";


@Injectable()
export class RequestService {

  constructor(
    protected api: HttpClient,
  ) {
  }

  getRequestInfo(id: Uuid) {
    const url = `requests/backoffice/${id}/info`;
    return this.api.post(url, {}).pipe(
      map((data: Request) => {
        return new Request(data);
      })
    );
  }

  getRequestPositions(id: Uuid): Observable<RequestPositionList[]> {
    const url = `requests/backoffice/${id}/positions`;
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
    const url = `requests/backoffice/${id}/positions-with-offers`;
    return this.api.get<any>(url);
  }

  publishRequest(id: Uuid) {
    const url = `requests/backoffice/${id}/publish`;
    return this.api.post(url, {});
  }

  changeStatus(id: Uuid, positionId: Uuid, status: string) {
    const url = `requests/backoffice/${id}/positions/${positionId}/change-status`;
    return this.api.post(url, {
      status: status
    });
  }
}

