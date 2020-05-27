import { KimPriceOrder } from "./kim-price-order";
import { KimPriceOrderPosition } from "./kim-price-order-position";
import { KimPriceOrderProposalPosition } from "./kim-price-order-proposal-position";

export class KimPriceOrderProposals extends KimPriceOrder {
  data: KimPriceOrderPositionWithProposals[];
}

export class KimPriceOrderPositionWithProposals {
  position: KimPriceOrderPosition;
  proposalPositions: KimPriceOrderProposalPosition[];
}
