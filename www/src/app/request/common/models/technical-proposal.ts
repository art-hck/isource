import {Uuid} from "../../../cart/models/uuid";
import { RequestPosition } from "./request-position";

export class TechnicalProposal {
  id: Uuid;
  name: string;
  contragent: object;
  createdDate: Date;
  updatedDate: Date;
  documents: []; // {id: '', name: ''} // надо ещё уточнить
  positions: TechnicalProposalPositions[];
  status: string;
}

export class TechnicalProposalPositions {
  id: Uuid;
  manufacturingName: string;
  position: RequestPosition;
  positionId: Uuid;
  technicalProposalId: Uuid;
}