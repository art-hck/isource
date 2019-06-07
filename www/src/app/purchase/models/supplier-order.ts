import {PurchasePricesInterface} from "./purchase-prices-interface";
import {AttachedFile} from "./attached-file";
import { SupplierPurchase } from "./supplier-purchase";

export interface SupplierOrder extends SupplierPurchase, PurchasePricesInterface {
  contracts: AttachedFile[];
  contractIsSignedBySupplier: boolean;
  contractIsSignedByCustomer: boolean;
}
