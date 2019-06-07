import {Uuid} from "../../cart/models/uuid";

export class OrderSupplier {
  id: Uuid;
  contagentId: Uuid;
  name: string;

  constructor(params?: Partial<OrderSupplier>) {
    Object.assign(this, params);
  }
}
