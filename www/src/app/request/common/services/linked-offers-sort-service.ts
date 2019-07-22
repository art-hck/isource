import { RequestPosition } from '../models/request-position';
import { RequestOfferPosition } from '../models/request-offer-position';

export class LinkedOffersSortService {

  sort(requestPositions: RequestPosition[]): void {
    for (const requestPosition of requestPositions) {
      this.sortLinkedOffers(requestPosition.linkedOffers);
    }
  }

  sortLinkedOffers(linkedOffers: RequestOfferPosition[]) {
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
