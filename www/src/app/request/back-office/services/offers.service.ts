import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Uuid} from "../../../cart/models/uuid";
import {LinkedOffers} from "../../common/models/linked-offers";


@Injectable()
export class OffersService {

  constructor(
    protected api: HttpClient,
  ) {
  }

  addOffer(id: Uuid, positionId, offer: LinkedOffers) {
    const url = `requests/backoffice/${id}/positions/${positionId}/add-offer`;
    return this.api.post(url, {
      supplierContragentName: offer.supplierContragentName,
      priceWithVat: offer.priceWithVat,
      currency: offer.currency,
      quantity: offer.quantity,
      measureUnit: offer.measureUnit,
      deliveryDate: offer.deliveryDate,
      paymentTerms: offer.paymentTerms
    });
  }

  publishOffers(id: Uuid, positionId) {
    const url = `requests/backoffice/${id}/positions/${positionId}/publish-offers`;
    return this.api.post(url, {})
  }
}

