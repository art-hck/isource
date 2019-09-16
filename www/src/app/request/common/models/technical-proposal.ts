import {Uuid} from "../../../cart/models/uuid";
import { TechnicalProposalPosition } from "./technical-proposal-position";
import { RequestDocument } from "./request-document";

export class TechnicalProposal {
  id: Uuid;
  name: string;
  contragent: object;
  createdDate: Date;
  updatedDate: Date;
  documents: RequestDocument[];
  positions: TechnicalProposalPosition[];
  status: string;
}
