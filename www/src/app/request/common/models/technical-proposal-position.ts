import { Uuid } from "../../../cart/models/uuid";
import { RequestPosition } from "./request-position";
import { History } from "./history";

export class TechnicalProposalPosition {
  id: Uuid;
  manufacturingName: string;
  position: RequestPosition;
  history: History;
  positionId: Uuid;
  technicalProposalId: Uuid;
  status: string;
  checked?: boolean;
}
