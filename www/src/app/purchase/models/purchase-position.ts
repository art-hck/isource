import { Uuid } from "src/app/cart/models/uuid";

export interface PurchasePosition {
  id: Uuid;
  title: string;
  quantity: number;
}
