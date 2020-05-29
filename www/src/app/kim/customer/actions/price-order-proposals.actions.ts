import { Uuid } from "../../../cart/models/uuid";

export namespace PriceOrderProposalsActions {
  export class Fetch {
    static readonly type = '[KimCustomerPriceOrderProposals] Fetch';
    constructor(public priceOrderId: Uuid) {
    }
  }
}
