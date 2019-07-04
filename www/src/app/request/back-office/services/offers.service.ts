import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Uuid} from "../../../cart/models/uuid";
import {RequestOfferPosition} from "../../common/models/request-offer-position";


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
}

