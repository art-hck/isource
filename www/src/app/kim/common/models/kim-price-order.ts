import { Uuid } from "../../../cart/models/uuid";
import { KimPriceOrderStatus } from "../enum/kim-price-order-status";
import { KimPriceOrderPosition } from "./kim-price-order-position";
import { OkatoRegionCode } from "../../../shared/models/okato-region";
import { EmployeeInfoBrief } from "../../../employee/models/employee-info";
import { ContragentInfo } from "../../../contragent/models/contragent-info";
import { KimPriceOrderType } from "../enum/kim-price-order-type";

export class KimPriceOrder {
  id: Uuid;
  etpKimId: number;
  userId: Uuid;
  user: EmployeeInfoBrief;
  contragentId: Uuid;
  contragent: ContragentInfo;
  name: string;
  deliveryAddress: string;
  deliveryConditions: string;
  dateResponse: string;
  dateDelivery: string;
  isForSmallBusiness: boolean;
  isForProducer: boolean;
  isForAuthorizedDealer: boolean;
  isRussianProduction: boolean;
  isDenyMaxPricePosition: boolean;
  regions: OkatoRegionCode;
  dateCreate: string;
  status: KimPriceOrderStatus;
  statusLabel: string;
  type: KimPriceOrderType;
  positions: KimPriceOrderPosition[];
}
