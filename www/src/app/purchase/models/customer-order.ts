import {PurchaseWinnerInfo} from "./purchase-winner-info";
import {PurchasePricesInterface} from "./purchase-prices-interface";
import {AttachedFile} from "./attached-file";
import {Purchase} from "./purchase";

export interface CustomerOrder extends Purchase, PurchasePricesInterface {
  supplier: PurchaseWinnerInfo;
  deliveryAddress: string;
  contracts: AttachedFile[];
  contractIsSignedByCustomer: boolean;
}
