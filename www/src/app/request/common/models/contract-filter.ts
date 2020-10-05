import { Uuid } from "../../../cart/models/uuid";
import { ContractStatus } from "../enum/contract-status";
import { ContragentList } from "../../../contragent/models/contragent-list";

export class ContractFilter {
  positionName?: string;
  suppliers?: (Uuid | ContragentList)[];
  statuses?: ContractStatus[];
}
