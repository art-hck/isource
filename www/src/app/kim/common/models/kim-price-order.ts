import { Uuid } from "../../../cart/models/uuid";
import { KimPriceOrderType } from "../enum/kim-price-order-type";
import { KimPriceOrderStatus } from "../enum/kim-price-order-status";
import { KimPriceOrderPosition } from "./kim-price-order-position";
import { OkatoRegionCode } from "../../../shared/models/okato-region";

export class KimPriceOrder {
  id: Uuid;
  name: string;
  regions: OkatoRegionCode;
  deliveryAddress: string;
  deliveryConditions: string;
  dateResponse: string;
  dateDelivery: string;
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
