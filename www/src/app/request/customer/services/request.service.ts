import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Uuid} from "../../../cart/models/uuid";


@Injectable()
export class RequestService {

  constructor(
    protected api: HttpClient,
  ) {
  }

  getRequestInfo(id: Uuid) {
    const url = `requests/customer/${id}/info`;
    return this.api.post(url, {});
  }

  getRequestPositions(id: Uuid) {
    const url = `requests/customer/${id}/positions`;
    return this.api.post(url, {});
  }

  choiceWinner(offerWinnerId: Uuid, positionId: Uuid, id: Uuid) {
    const url = `requests/customer/${id}/positions/${positionId}/choose-winner`;
    return this.api.post(url, {
      requestOfferPositionId: offerWinnerId
    });
  }
}
