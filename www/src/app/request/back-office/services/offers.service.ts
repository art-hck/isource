import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Uuid} from "../../../cart/models/uuid";
import {RequestOfferPosition} from "../../common/models/request-offer-position";
import { Observable } from "rxjs";
import { RequestDocument } from "../../common/models/request-document";


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
}
