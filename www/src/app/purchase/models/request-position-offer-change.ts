import { PurchasePosition } from "./purchase-position";
import { OfferChangeItem } from "./offer-change-item";

export interface RequestPositionOfferChange {
  position: PurchasePosition;
  initialOffer: OfferChangeItem;
  offerForChange: OfferChangeItem;
}
