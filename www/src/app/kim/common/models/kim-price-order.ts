import { Uuid } from "../../../cart/models/uuid";
import { ContragentShortInfo } from "../../../contragent/models/contragent-short-info";
import { PositionCurrency } from "../../../request/common/enum/position-currency";

export class KimPriceOrder {
  id: Uuid;
  name: string;
  deliveryAddress: string;
  deliveryConditions: string;
  dateResponse: string;
  dateDelivery: string;
  dateCreate: string;
  expires: string;
  positions: {
    name: string
    proposals?: {
      contagent: ContragentShortInfo,
      quantity: number,
      price: number
      currency: PositionCurrency,
      deliveryDate: string,
      status: "NEW" | "APPROVED" | "REJECTED"
    }[];
  }[];
}
