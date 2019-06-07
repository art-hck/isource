import { Purchase } from "./purchase";
import { Customer } from "./customer";

export interface SupplierPurchase extends Purchase {
  customer: Customer;
  deliveryCost: number;
  deliveryAddress: string;
  offerCost: number;
  offerCount: number;
  isWinner: boolean;
}
