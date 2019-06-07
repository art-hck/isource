import {Uuid} from "../../cart/models/uuid";
import { Product } from "./product";

export class OrderPosition {
  id: Uuid;
  product: Product;
  priceWithVat: number;
  vatPercent: number;
  quantity: number;
  supplierResponseType: string;

  constructor(params?: Partial<OrderPosition>) {
    Object.assign(this, params);

    if (params.product) {
      this.product = new Product(params.product);
    }
  }
}
