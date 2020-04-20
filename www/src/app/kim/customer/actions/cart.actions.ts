import { KimPriceOrder } from "../../common/models/kim-price-order";

export namespace CartActions {
  export class Fetch {
    static readonly type = '[Kim Customer Cart] Fetch';
  }

  export class CreatePriceOrder {
    static readonly type = '[Kim Customer Cart] Create Price Order';
    constructor(public payload: Partial<KimPriceOrder>) {}
  }
}
