import { Uuid } from "../../../cart/models/uuid";
import { PositionCurrency } from "../../../request/common/enum/position-currency";
import { KimProceOrderSupplier } from "./kim-proce-order-supplier";

export class KimPriceOrderProposal {
  id: Uuid;
  userId: Uuid;
  proposalSupplierId: Uuid;
  priceWithVat: number;
  priceWithoutVat: number;
  vatPercent: number;
  currency: PositionCurrency;
  quantity: number;
  // measureUnit: string;
  createdDate: string;
  proposalSupplier: KimProceOrderSupplier;
  isAnalog: boolean;
  isWinner: boolean;
}
