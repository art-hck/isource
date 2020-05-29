import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Uuid } from "../../../cart/models/uuid";
import { Observable } from "rxjs";
import { RequestPosition } from "../../common/models/request-position";
import { map } from "rxjs/operators";
import { RequestPositionList } from "../../common/models/request-position-list";
import { RequestGroup } from "../../common/models/request-group";
import { Request } from "../../common/models/request";
import { PositionStatus } from "../../common/enum/position-status";
import { User } from "../../../user/models/user";
import { UserInfoService } from "../../../user/service/user-info.service";
import { RequestDocument } from "../../common/models/request-document";
import { FormDataService } from "../../../shared/services/form-data.service";
import { Page } from "../../../core/models/page";
import { RequestsList } from "../../common/models/requests-list/requests-list";
import { AvailableFilters } from "../models/available-filters";
import { RequestStatusCount } from "../../common/models/requests-list/request-status-count";
import { PositionsWithSuppliers } from "../models/positions-with-suppliers";


@Injectable({
  providedIn: "root"
})
export class RequestService {

  constructor(
    protected api: HttpClient,
    public user: UserInfoService,
    public formDataService: FormDataService,
  ) {
  }

  getRequests(startFrom, pageSize, filters, sort): Observable<Page<RequestsList>> {
    const url = `requests/backoffice/list`;
    return this.api.post<Page<RequestsList>>(url, { startFrom, pageSize, filters, sort });
  }

  getRequest(id: Uuid) {
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

  getRequestPosition(requestId: Uuid, positionId: Uuid): Observable<RequestPosition> {
    const url = `requests/backoffice/${requestId}/positions/${positionId}/info`;
    return this.api.get<RequestPosition>(url);
  }

  getRequestPositionsWithOffers(id: Uuid): Observable<any> {
    const url = `requests/backoffice/${id}/positions-with-offers`;
    return this.api.get<PositionsWithSuppliers>(url);
  }

  requestStatusCount() {
    const url = `requests/backoffice/counts-on-different-statuses`;
    return this.api.get<RequestStatusCount>(url);
  }

  publishRequest(id: Uuid, positions: [string]) {
    const url = `requests/backoffice/${id}/positions/publish`;
    return this.api.post(url, {positions});
  }

  changeStatus(id: Uuid, positionId: Uuid, status: string) {
    const url = `requests/backoffice/${id}/positions/${positionId}/change-status`;
    return this.api.post<{status: PositionStatus, statusLabel: string, availableStatuses: string[]}>(url, {
      status: status
    });
  }

  // Функция не подсвечивается, но она на самом деле используется
  uploadDocuments(requestPosition: RequestPosition, files: File[]): Observable<RequestDocument[]> {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files[]', file, file.name);
    });

    return this.api.post<RequestDocument[]>(
      `requests/backoffice/${requestPosition.request.id}/positions/${requestPosition.id}/documents/upload`,
      formData
    );
  }

  setResponsibleUser(id: Uuid, user: User, positions: RequestPosition[]) {
    const url = `requests/backoffice/${id}/change-responsible-user`;
    const body = {user: user.id, positions: positions.map(position => position.id)};
    return this.api.post(url, body);
  }

  addPositionsFromExcel(requestId: Uuid, files: File[]): Observable<any> {
    const url = `requests/backoffice/${requestId}/add-positions/from-excel`;
    return this.api.post(url, this.formDataService.toFormData({ files })); // @TODO Typization!
  }

  availableFilters() {
    const url = `requests/backoffice/available-filters`;
    return this.api.get<AvailableFilters>(url);
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

  changeHiddenContragents(requestId: Uuid, value: boolean) {
    const url = `requests/backoffice/${requestId}/hide-contragent`;
    return this.api.post(url, {hideContragent: value});
  }
}

