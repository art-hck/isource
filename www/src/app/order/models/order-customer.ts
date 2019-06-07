import {Uuid} from "../../cart/models/uuid";

export class OrderCustomer {
  id: Uuid;
  contragentId: Uuid;
  name: string;

  constructor(params?: Partial<OrderCustomer>) {
    Object.assign(this, params);
  }
}
