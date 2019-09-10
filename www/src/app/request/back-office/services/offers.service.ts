import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Uuid} from "../../../cart/models/uuid";
import {RequestOfferPosition} from "../../common/models/request-offer-position";
import { Observable } from "rxjs";
import { RequestDocument } from "../../common/models/request-document";
import { Request } from "../../common/models/request";
import { saveAs } from 'file-saver/src/FileSaver';
import {RequestPosition} from "../../common/models/request-position";
import {RequestPositionList} from "../../common/models/request-position-list";

@Injectable()
export class OffersService {

  constructor(
    protected api: HttpClient,
  ) {
  }

  addOffer(id: Uuid, positionId, offer: RequestOfferPosition) {
    const url = `requests/backoffice/${id}/positions/${positionId}/add-offer`;
    return this.api.post(url, offer);
  }

  publishOffers(id: Uuid, positionId) {
    const url = `requests/backoffice/${id}/positions/${positionId}/publish-offers`;
    return this.api.post(url, {});
  }

  publishRequestOffers(id: Uuid, requestPositions: RequestPosition[]) {
    const url = `requests/backoffice/${id}/publish-offers`;
      const ids = [];
      for (const requestPosition of requestPositions) {
        ids.push(requestPosition.id);
      }
    return this.api.post(url, {
      positionIds: ids
    });
  }

  uploadDocuments(offer: RequestOfferPosition, files: File[]): Observable<RequestDocument[]> {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files[]', file, file.name);
    });

    const url = `requests/backoffice/offers/${offer.id}/documents/upload`;
    return this.api.post<RequestDocument[]>(url, formData);
  }

  uploadTechnicalProposals(offer: RequestOfferPosition, files: File[]): Observable<RequestDocument[]> {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files[]', file, file.name);
    });

    const url = `requests/backoffice/offers/${offer.id}/technical-proposals/upload`;
    return this.api.post<RequestDocument[]>(url, formData);
  }

  downloadOffersTemplate(request: Request): void {
    this.api.post(
      `requests/backoffice/${request.id}/download-offers-template`,
      {},
      {responseType: 'blob'})
      .subscribe(data => {
        saveAs(data, `Request${request.number}OffersTemplate.xlsx`);
      });
  }
}
