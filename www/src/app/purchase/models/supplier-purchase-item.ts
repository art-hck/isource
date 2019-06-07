import { PurchaseItem } from "./purchase-item";
import { SupplierPurchaseLinkedItem } from "./supplier-purchase-linked-item";
import { ReplacementRequest } from "./replacement-request";

export interface SupplierPurchaseItem extends PurchaseItem {
  availability: boolean;
  linkedItems?: SupplierPurchaseLinkedItem[];
  replacementRequest?: ReplacementRequest;
  mainLinkedItem?: SupplierPurchaseLinkedItem;
}
