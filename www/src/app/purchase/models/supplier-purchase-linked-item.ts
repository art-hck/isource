import { Uuid } from "../../cart/models/uuid";

export interface SupplierPurchaseLinkedItem {
  id: Uuid;
  priceListId?: Uuid;
  title: string;
  price: number;
  analogue: boolean;
  isMainItem: boolean;
}
