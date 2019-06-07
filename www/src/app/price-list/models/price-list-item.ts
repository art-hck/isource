import { MeasureUnitItem } from "../../core/models/measure-unit-item";
import { CurrencyItem } from "../../core/models/currency-item";

export class PriceListItem {
  currency: CurrencyItem;
  itemName: string;
  ndsPercent: number;
  units: MeasureUnitItem;
  priceWithNds: number;
  supplierRegion?: string;
  tth?: string;

  constructor(params?: Partial<PriceListItem>) {
    Object.assign(this, params);
  }
}
