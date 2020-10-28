import { RequestPosition } from "../../common/models/request-position";
import { ContragentList } from "../../../contragent/models/contragent-list";
import { SupplierProposalInfo } from "./supplier-proposal-info";

export class PositionsWithSuppliers {
  positions: RequestPosition[];
  suppliers: SupplierProposalInfo[];
}
