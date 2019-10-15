import { Uuid } from "../../../cart/models/uuid";

export class ActivityData {
  newStatus?: string;
  newStatusLabel?: string;
  oldStatus?: string;
  oldStatusLabel?: string;
  newValues?: Object;
  oldValues?: Object;
  filename?: string;
  positionName?: string;
  supplierId: Uuid;
  supplierName?: string;
  offerQuantity?: number;
  offerMeasureUnit?: string;
  offerPrice?: number;
  offerCurrency?: string;
}
