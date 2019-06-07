import {PricelistItem} from "./pricelist-item";
import {ProductAttribute} from "./product-attribute";

export class CatalogProduct {
  id?: string;
  short_title?: string;
  title?: string;
  code?: string;
  measure_units?: string;
  min_price_with_vat?: number;
  offers_count?: number;
  currency?: Object;
  supplier?: Object;
  attributes: ProductAttribute[];
  topPrices?: PricelistItem[];

  constructor(params?: Partial<CatalogProduct>) {
    Object.assign(this, params);
  }
}
