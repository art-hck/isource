import { Uuid } from "../../../cart/models/uuid";
import { ProcedureSource } from "../../common/enum/procedure-source";

export class Procedure {
  procedureTitle: string;
  dateEndRegistration: string;
  positions: Uuid[];
  manualEndRegistration: boolean;
  positionsAllowAnalogsOnly: boolean;
  positionsAnalogs: boolean;
  positionsApplicsVisibility: "PriceAndRating" | "OnlyPrice" | "OnlyRating" | "None";
  positionsBestPriceType: "LowerStartPrice" | "LowerPriceBest";
  positionsEntireVolume: boolean;
  positionsRequiredAll: boolean;
  positionsSuppliersVisibility: "Name" | "NameHidden" | "None";

  dishonestSuppliersForbidden: boolean;
  prolongateEndRegistration: number;
  procedureDocuments: [];
  procedureLotDocuments: Uuid[];
  privateAccessContragents: [];
  getTPFilesOnImport: boolean;
  source: ProcedureSource;
}
