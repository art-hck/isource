import {Uuid} from "../../../cart/models/uuid";
import { TechnicalProposalPositions } from "./technical-proposal-positions";

export class TechnicalProposal {
  id: Uuid;
  name: string;
  contragent: object;
  createdDate: Date;
  updatedDate: Date;
  documents: object;
  positions: TechnicalProposalPositions[];
  status: string;
}