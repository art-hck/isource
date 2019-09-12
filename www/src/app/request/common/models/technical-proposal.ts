import {Uuid} from "../../../cart/models/uuid";
import { TechnicalProposalPosition } from "./technical-proposal-position";

export class TechnicalProposal {
  id: Uuid;
  name: string;
  contragent: object;
  createdDate: Date;
  updatedDate: Date;
  documents: object;
  positions: TechnicalProposalPosition[];
  status: string;
}
