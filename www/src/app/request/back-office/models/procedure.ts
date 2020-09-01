import { Uuid } from "../../../cart/models/uuid";
import { ProcedureSource } from "../enum/procedure-source";
import { RequestDocument } from "../../common/models/request-document";
import { ContragentShortInfo } from "../../../contragent/models/contragent-short-info";
import { RequestPosition } from "../../common/models/request-position";

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
  dateSummingUp: string;
  datePublished: string;
  lotId: number;
  offersImported: boolean;
  isRetrade: boolean;
  canRetrade: boolean;
  positions: {
    contragent: ContragentShortInfo
    id: Uuid
    lotId: number
    procedureId: number
    requestPosition: RequestPosition
    requestPositionId: Uuid
    requestProcedureId: Uuid
    unitId: number
  }[];
  manualEndRegistration: boolean;
  positionsAllowAnalogsOnly: boolean;
  positionsAnalogs: boolean;
  positionsApplicsVisibility: "PriceAndRating" | "OnlyPrice" | "OnlyRating" | "None";
  positionsBestPriceType: "LowerStartPrice" | "LowerPriceBest";
  bestPriceRequirements: boolean;
  positionsEntireVolume: boolean;
  positionsRequiredAll: boolean;
  withoutTotalPrice: boolean;
  withoutTotalPriceReason: string;
  positionsSuppliersVisibility: "Name" | "NameHidden" | "None";

  dishonestSuppliersForbidden: boolean;
  okpd2: string;
  procedureLotDocuments: RequestDocument[];
  prolongateEndRegistration: number;
  procedureDocuments: RequestDocument[];
  privateAccessContragents: ContragentShortInfo[];
  getTPFilesOnImport: boolean;
  source: ProcedureSource;
}
