import { PositionCurrency } from "../../../request/common/enum/position-currency";
import { Uuid } from "../../../cart/models/uuid";
import { ContragentShortInfo } from "../../../contragent/models/contragent-short-info";

export class Proposal<T = any> {
  id: Uuid;
  deliveryDate: string;
  quantity: number;
  currency: PositionCurrency;
  priceWithoutVat: number;
  isWinner: boolean;
  isAnalog: boolean;
  measureUnit: string;
  supplierContragent?: ContragentShortInfo;

  constructor(public sourceProposal?: T, toProposalFn?: (sourceProposal: T) => Proposal<T>) {
    Object.assign(this, (toProposalFn && toProposalFn(sourceProposal)) ?? sourceProposal);
  }
}
