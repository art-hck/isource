import { KimPriceOrder } from "../models/kim-price-order";
import { Uuid } from "../../cart/models/uuid";

export namespace TradeRequestActions {
  export class Fetch {
    static readonly type = '[Trade] Fetch';
  }

  export class Create {
    static readonly type = '[Trade] Create Request';
    constructor(public payload: Partial<KimPriceOrder>) {}
  }

  export class Update {
    static readonly type = '[Trade] Update Request';
    constructor(public payload: Partial<KimPriceOrder> & {id: Uuid}) {}
  }
}
