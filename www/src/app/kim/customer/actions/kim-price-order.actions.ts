import { KimPriceOrder } from "../../common/models/kim-price-order";
import { Uuid } from "../../../cart/models/uuid";

export namespace KimRequestActions {
  export class Fetch {
    static readonly type = '[Kim Customer] Fetch';
  }

  export class Create {
    static readonly type = '[Kim Customer] Create Request';
    constructor(public payload: Partial<KimPriceOrder>) {}
  }

  export class Update {
    static readonly type = '[Kim Customer] Update Request';
    constructor(public payload: Partial<KimPriceOrder> & {id: Uuid}) {}
  }
}
