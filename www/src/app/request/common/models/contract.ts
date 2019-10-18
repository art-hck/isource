import { Uuid } from "../../../cart/models/uuid";
import { RequestDocument } from "./request-document";
import { ContragentList } from "../../../contragent/models/contragent-list";
import { Winner } from "./winner";

export class Contract {
  id: Uuid;
  request: {
    id: Uuid
  };
  customer: ContragentList;
  supplier: ContragentList;
  createdDate: string;
  winners: Winner[];
  documents: RequestDocument[];
  status: ContractStatus;
}

export enum ContractStatus {
  NEW = 'NEW',
  ON_APPROVAL = 'ON_APPROVAL',
  REJECTED = 'REJECTED',
  APPROVAL = 'APPROVAL'
}
