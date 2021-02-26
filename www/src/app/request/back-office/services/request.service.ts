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
import { UserInfoService } from "../../../user/service/user-info.service";
import { FormDataService } from "../../../shared/services/form-data.service";
import { Page } from "../../../core/models/page";
import { RequestsList } from "../../common/models/requests-list/requests-list";
import { AvailableFilters } from "../models/available-filters";
import { RequestStatusCount } from "../../common/models/requests-list/request-status-count";
import { RequestAvailableFilters } from "../../common/models/request-available-filters";
import { RequestFilters } from "../../common/models/request-filters";


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

  getRequestPositions(id: Uuid, filters: RequestFilters): Observable<RequestPositionList[]> {
    const url = `requests/backoffice/${id}/positions`;
    return this.api.post<RequestPositionList[]>(url, { filters }).pipe(
      map(data => this.mapPositionList(data))
    );
  }

  requestStatusCount() {
    const url = `requests/backoffice/counts-on-different-statuses`;
    return this.api.get<RequestStatusCount>(url);
  }

  publishRequest(id: Uuid, positions: [string]) {
    const url = `requests/backoffice/${id}/positions/publish`;
    return this.api.post(url, {positions});
  }

  attachDocuments(id: Uuid, positionIds: Uuid[], files: File[]) {
    const url = `requests/${id}/positions/attach-documents-batch`;
    return this.api.post(url, this.formDataService.toFormData({ positions: positionIds, files }));
  }

  editRequestName(requestId: Uuid, requestName: string) {
    const url = `requests/${requestId}/edit-name`;
    return this.api.post(url, { id: requestId, name: requestName });
  }

  changeStatus(id: Uuid, positionId: Uuid, status: string) {
    const url = `requests/backoffice/${id}/positions/${positionId}/change-status`;
    return this.api.post<{status: PositionStatus, statusLabel: string, availableStatuses: string[]}>(url, {
      status: status
    });
  }

  changeResponsibleUser(id: Uuid, user: Uuid) {
    const url = `requests/backoffice/${id}/change-responsible-user`;
    return this.api.post(url, { user });
  }

  changeResponsibleUserPositions(id: Uuid, user: Uuid, positions: Uuid[]) {
    const url = `requests/backoffice/${id}/positions/change-responsible-user`;
    return this.api.post(url, { user, positions });
  }

  addPositionsFromExcel(requestId: Uuid, files: File[]): Observable<any> {
    const url = `requests/backoffice/${requestId}/add-positions/from-excel`;
    return this.api.post(url, this.formDataService.toFormData({ files })); // @TODO Typization!
  }

  availableFilters() {
    const url = `requests/backoffice/available-filters`;
    return this.api.get<AvailableFilters>(url);
  }

  requestAvailableFilters(requestId, filters: RequestFilters) {
    const url = `requests/backoffice/${requestId}/available-filters`;
    return this.api.post<RequestAvailableFilters>(url, { filters });
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

  downloadRequests(requestIds) {
    const url = `requests/backoffice/download`;
    return this.api.post(url, { requestIds }, { responseType: 'blob' });
  }
}

