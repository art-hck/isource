import { RequestPosition } from "../../common/models/request-position";
import { SupplierCommercialProposalInfo } from "./supplier-commercial-proposal-info";

export class PositionsWithSuppliers {
  positions: RequestPosition[];
  suppliers: SupplierCommercialProposalInfo[];
}
