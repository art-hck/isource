import { Uuid } from "../../../cart/models/uuid";
import { PositionStatus } from "../enum/position-status";
import { History } from "./history";
import { CommonProposalItemStatus } from "./common-proposal";

export class ProposalGroup<T extends ProposalGroupPosition | Uuid = ProposalGroupPosition> {
  id: Uuid;
  requestId: Uuid;
  name: string;
  createdDate: string;
  status: CommonProposalItemStatus;
  statusLabel: string;
  requestPositions: T[];
}

export class ProposalGroupPosition {
  id: Uuid;
  name: string;
  status: PositionStatus;
  number: number;
  history: History;
}
