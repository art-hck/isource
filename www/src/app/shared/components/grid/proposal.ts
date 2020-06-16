import { PositionCurrency } from "../../../request/common/enum/position-currency";
import { Uuid } from "../../../cart/models/uuid";

export class Proposal<T = any> {
  id: Uuid;
  deliveryDate: string;
  quantity: number;
  currency: PositionCurrency;
  priceWithoutVat: number;
  isWinner: boolean;
  measureUnit: string;

  constructor(public sourceProposal?: T, toProposalFn?: (sourceProposal: T) => Proposal<T>) {
    Object.assign(this, (toProposalFn && toProposalFn(sourceProposal)) ?? sourceProposal);
  }
}
