import { Uuid } from "../../../cart/models/uuid";
import { PositionStatus } from "../enum/position-status";

export class TechnicalCommercialProposalGroup {
  id: Uuid;
  requestId: Uuid;
  name: string;
  createdDate: string;
  requestPositions: {
    id: Uuid,
    name: string,
    status: PositionStatus,
    number: 8
  }[];
}

