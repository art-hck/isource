import { RequestPosition } from '../models/request-position';
import { RequestOfferPosition } from '../models/request-offer-position';

export class LinkedOffersSortService {

  sortLinkedOffers(linkedOffers: RequestOfferPosition[]): void {
    const winner = linkedOffers.find((lo) => {
      return lo.isWinner;
    });
    if (!winner) {
      return;
    }
    const index = linkedOffers.indexOf(winner);
    linkedOffers.splice(index, 1);
    linkedOffers.splice(0, 0, winner);
  }

}
