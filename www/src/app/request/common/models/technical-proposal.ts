import {Uuid} from "../../../cart/models/uuid";
import { TechnicalProposalPosition } from "./technical-proposal-position";
import { RequestDocument } from "./request-document";
import { ContragentInfo } from "../../../contragent/models/contragent-info";
import { TechnicalProposalsStatuses } from "../enum/technical-proposals-statuses";

export class TechnicalProposal {
  id: Uuid;
  name: string;
  supplierContragent: ContragentInfo;
  createdDate: Date;
  updatedDate: Date;
  documents: RequestDocument[];
  positions: TechnicalProposalPosition[];
  status: TechnicalProposalsStatuses;
  statusChangedDate: Date;
}
