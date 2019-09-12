import {Uuid} from "../../../cart/models/uuid";
import { RequestPosition } from "./request-position";

export class TechnicalProposalPosition {
  id: Uuid;
  manufacturingName: string;
  position: RequestPosition;
  positionId: Uuid;
  technicalProposalId: Uuid;
}
