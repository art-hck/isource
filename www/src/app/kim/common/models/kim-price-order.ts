import { Uuid } from "../../../cart/models/uuid";
import { KimPriceOrderType } from "../enum/kim-price-order-type";
import { KimPriceOrderStatus } from "../enum/kim-price-order-status";
import { KimPriceOrderPosition } from "./kim-price-order-position";

export class KimPriceOrder {
  id: Uuid;
  name: string;
  regions: string[]; // из ОКАТО
  deliveryAddress: string;
  deliveryConditions: string;
  dateResponse: string; // +3 дня с текущей даты
  dateDelivery: string; // после dateResponse
  dateCreate: string;
  type: KimPriceOrderType;
  status: KimPriceOrderStatus;
  forSmallBusiness: boolean;
  forProducer: boolean;
  forAuthorizedDealer: boolean;
  russianProduction: boolean;
  denyMaxPricePosition: boolean;
  positions: KimPriceOrderPosition[];
}
