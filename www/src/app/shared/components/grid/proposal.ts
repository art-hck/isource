export class Proposal<T = any> {
  deliveryDate: string;
  quantity: number;
  priceWithoutVat: number;

  constructor(public sourceProposal?: T, toProposalFn?: (sourceProposal: T) => Proposal<T>) {
    Object.assign(this, (toProposalFn && toProposalFn(sourceProposal)) ?? sourceProposal);
  }
}
