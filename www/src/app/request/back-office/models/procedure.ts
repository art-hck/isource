import { Uuid } from "../../../cart/models/uuid";
import { ProcedureSource } from "../../common/enum/procedure-source";
import { RequestDocument } from "../../common/models/request-document";
import { ContragentShortInfo } from "../../../contragent/models/contragent-short-info";

export class Procedure {
  id: Uuid;
  procedureId: number;
  contactEmail: string;
  contactPerson: string;
  contactPhone: string;
  createdDate: string;
  remoteId: string;
  requestId: Uuid;
  procedureTitle: string;
  dateEndRegistration: string;
  datePublished: string;
  lotId: number;
  offersImported: false;
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
  procedureLotDocuments: RequestDocument[];
  prolongateEndRegistration: number;
  procedureDocuments: RequestDocument[];
  privateAccessContragents: ContragentShortInfo[];
  getTPFilesOnImport: boolean;
  source: ProcedureSource;
}
