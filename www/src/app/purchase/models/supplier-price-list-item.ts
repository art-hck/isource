import { Uuid } from "../../cart/models/uuid";

export class SupplierPriceListItem {
  id: Uuid;
  itemName: string;
  priceWithVat: number;
  lastUpdatedDate: string;
  linksExist?: boolean;

  constructor(params?: Partial<SupplierPriceListItem>) {
    Object.assign(this, params);
  }
}
