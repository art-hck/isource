import { Uuid } from "../../../cart/models/uuid";
import { PositionStatus } from "../enum/position-status";
import { History } from "./history";

export class TechnicalCommercialProposalGroup {
  id: Uuid;
  requestId: Uuid;
  name: string;
  createdDate: string;
  status: string;
  statusLabel: string;
  requestPositions: {
    id: Uuid,
    name: string,
    status: PositionStatus,
    number: 8,
    history: History
  }[];
}

