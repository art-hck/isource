import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Uuid } from "../../../cart/models/uuid";
import { Observable } from "rxjs";
import { RequestPosition } from "../../common/models/request-position";
import { map } from "rxjs/operators";
import { RequestPositionList } from "../../common/models/request-position-list";
import { RequestGroup } from "../../common/models/request-group";
import { Request } from "../../common/models/request";
import { RequestPositionWorkflowSteps } from "../../common/enum/request-position-workflow-steps";


@Injectable()
export class RequestService {

  constructor(protected api: HttpClient) {
  }

  getRequestInfo(id: Uuid) {
    const url = `requests/backoffice/${id}/info`;
    return this.api.post<Request>(url, {})
      .pipe(map(data => new Request(data)));
  }

  getRequestPositions(id: Uuid): Observable<RequestPositionList[]> {
    const url = `requests/backoffice/${id}/positions`;
    return this.api.post<RequestPositionList[]>(url, {}).pipe(
      map(data => this.mapPositionList(data))
    );
  }

  getRequestPosition(id: Uuid) {
    const url = `requests/positions/${id}/info`;
    return this.api.get<RequestPosition>(url);
  }

  /**
   * Преобразует RequestPositionList в одноуровневый массив позиций без групп
   */
  getRequestPositionsFlat(id: Uuid): Observable<RequestPosition[]> {
    return this.getRequestPositions(id).pipe(map(
      requestPositionsList =>
        requestPositionsList.reduce(
          function flatPositionList(arr, curr: RequestPositionList) {
            if (curr instanceof RequestGroup) {
              return flatPositionList(curr.positions, null);
            } else {
              return [...arr, curr].filter(Boolean);
            }
          }, [])
    ));
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
    return this.api.post<{status: RequestPositionWorkflowSteps, statusLabel: string}>(url, {
      status: status
    });
  }

  private mapPositionList(requestPositionsList: RequestPositionList[]) {
    return requestPositionsList.map(
      function recursiveMapPositionList(item: RequestPositionList) {
        switch (item.entityType) {
          case 'GROUP':
            const group = new RequestGroup(item);
            group.positions = group.positions.map(recursiveMapPositionList);

            return group;
          case 'POSITION':
            return new RequestPosition(item);
        }
      });
  }
}

