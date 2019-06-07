import { Uuid } from "src/app/cart/models/uuid";

export interface OfferChangeItem {
  id: Uuid;
  title: string;
  price: number;
}
