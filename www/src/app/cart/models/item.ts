import {Uuid} from './uuid';

export class Item {

  item_id: Uuid;
  supplier_id: Uuid;
  supplier: {
    id: Uuid,
    name: string
  };
  price_without_nds: number;
  price_with_nds: number;
  nds_percent: number;
  category_product: {
    id: Uuid,
    title: string,
    short_title: string,
    code: string
  };
  custom_classifier_categories_code: string;

  quantity?: number;

  constructor(params?: Partial<Item>) {
    Object.assign(this, params);
  }

  getSum(): number {
    const quantity = this.quantity || 0;
    const price = this.price_with_nds || 0;
    return quantity * price;
  }

  getCode(): string {
    return this.custom_classifier_categories_code + '.' + this.category_product.code;
  }
}
