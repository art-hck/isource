import {Uuid} from "../../../cart/models/uuid";
import {RequestPosition} from "../../common/models/request-position";

export interface ProcedureInfo {
  dateEndRegistration: string;
  summingupDate: string;
  dishonestSuppliersForbidden: boolean;
  positions: RequestPosition[];
  procedureTitle: string;
}
