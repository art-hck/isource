import { RequestPosition } from "../../common/models/request-position";
import { ContragentList } from "../../../contragent/models/contragent-list";

export class PositionsWithSuppliers {
  positions: RequestPosition[];
  suppliers: ContragentList[];
}
