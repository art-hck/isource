import { Uuid } from "../../../cart/models/uuid";
import { TechnicalProposalsStatus } from "../enum/technical-proposals-status";
import { ContragentInfo } from "../../../contragent/models/contragent-info";

export class TechnicalProposalFilter {
  positionName?: string;
  contragents?: (Uuid | ContragentInfo)[];
  tpStatus?: TechnicalProposalsStatus[];
}
