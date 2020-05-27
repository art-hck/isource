import { Uuid } from "../../../cart/models/uuid";
import { PositionCurrency } from "../../../request/common/enum/position-currency";
import { KimPriceOrderPosition } from "./kim-price-order-position";
import { ContragentShortInfo } from "../../../contragent/models/contragent-short-info";

export class KimPriceOrderProposalPosition {
  id: Uuid;
  proposalId: Uuid;
  priceWithVat: number;
  priceWithoutVat: number;
  vatPercent: number;
  currency: PositionCurrency;
  quantity: number;
  measureUnit: string;
  deliveryDate: string;
  paymentTerms: string;
  supplier: ContragentShortInfo;
  isAnalog: boolean;
  isWinner: boolean;
  position: Partial<KimPriceOrderPosition>;
}
