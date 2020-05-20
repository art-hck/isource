import { Uuid } from "../../../cart/models/uuid";

export class TechnicalProposalFilter {
  positionName?: string;
  contragents?: Uuid[];
  tpStatus?: string[];
}
