import { Uuid } from "../../../cart/models/uuid";
import { PositionStatus } from "../enum/position-status";
import { History } from "./history";
import { TechnicalCommercialProposalStatus } from "../enum/technical-commercial-proposal-status";

export class ProposalGroup {
  id: Uuid;
  requestId: Uuid;
  name: string;
  createdDate: string;
  status: TechnicalCommercialProposalStatus;
  statusLabel: string;
  requestPositions: {
    id: Uuid,
    name: string,
    status: PositionStatus,
    number: number,
    history: History
  }[];
}

