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
import { FormDataService } from "../../../shared/services/form-data.service";
import { Page } from "../../../core/models/page";
import { RequestsList } from "../../common/models/requests-list/requests-list";

@Injectable({
  providedIn: "root"
})
export class RequestService {

  constructor(
    private api: HttpClient,
    private formDataService: FormDataService
  ) {
  }

  getRequests(startFrom, pageSize, filters, sort): Observable<Page<RequestsList>> {
    const url = `requests/customer/list`;
    return this.api.post<Page<RequestsList>>(url, { startFrom, pageSize, filters, sort });
  }

  addRequest(name: string, positions: Array<any>): Observable<Request> {
    const requestData = this.formDataService.toFormData({ name, positions });

    return this.api.post<Request>(`requests/customer/add-request/manual`, requestData);
  }

  addFreeFormRequest(request: Partial<Request>) {
    return this.api.post<Request>(
      `requests/customer/add-request/free-form`,
      this.formDataService.toFormData({request}));
  }

  addRequestFromExcel(files: File[], requestName: string) {
    const data = {
      files: files,
      name: requestName
    };

    const requestData = this.formDataService.toFormData(data);

    return this.api.post<{id: Uuid}>(`requests/customer/add-request/from-excel`, requestData);
  }

  getRequest(id: Uuid) {
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
        return data.map(function recursiveMapPositionList(item: RequestPositionList) {
          switch (item.entityType) {
            case 'GROUP':
              const group = new RequestGroup(item);
              group.positions = group.positions.map(recursiveMapPositionList);

              return group;
            case 'POSITION':
              return new RequestPosition(item);
          }
        });
      })
    );
  }

  getRequestPosition(requestId: Uuid, positionId: Uuid) {
    const url = `requests/customer/${requestId}/positions/${positionId}/info`;
    return this.api.get<RequestPosition>(url);
  }

  /**
   * Преобразует RequestPositionList в одноуровневый массив позиций без групп
   */
  getRequestPositionsFlat(requestPositionsList: RequestPositionList[]): RequestPosition[] {
    return requestPositionsList.reduce(function flatPositionList(arr, curr: RequestPositionList) {
      if (curr instanceof RequestGroup) {
        return [...arr, ...flatPositionList(curr.positions, null)];
      } else {
        return [...arr, curr].filter(Boolean);
      }
    }, []);
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
      `requests/customer/${requestPosition.request.id}/positions/${requestPosition.id}/documents/upload`,
      formData
    );
  }

  sendForAgreement(requestId: Uuid, selectedOffers: object) {
    const url = `requests/customer/${requestId}/commercial-proposals/accept`;
    return this.api.post(url, selectedOffers);
  }

  addPositionsFromExcel(requestId: Uuid, files: File[]): Observable<any> {
    const url = `requests/customer/${requestId}/add-positions/from-excel`;
    return this.api.post(url, this.formDataService.toFormData({files}));
  }
}
