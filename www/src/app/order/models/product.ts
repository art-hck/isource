import {Uuid} from "../../cart/models/uuid";

export class Product {
  id: Uuid;
  code: string;
  shortTitle: string;
  title: string;

  constructor(params?: Partial<Product>) {
    Object.assign(this, params);
  }
}
