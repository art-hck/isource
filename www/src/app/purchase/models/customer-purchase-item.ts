import { PurchaseItem } from "./purchase-item";

export interface CustomerPurchaseItem extends PurchaseItem {
  startMaxCost: number;
  mappedItems: Array<Object>; // TODO: 2018-10-02 Убрать после разделения массивов тестовых данных
}
