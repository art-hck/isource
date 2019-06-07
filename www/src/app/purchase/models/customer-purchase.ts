import { Purchase } from "./purchase";

export interface CustomerPurchase extends Purchase {
  supplierOffersCount: number;
}
