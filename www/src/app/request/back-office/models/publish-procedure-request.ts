import { PublishProcedureInfo } from "./publish-procedure-info";

export interface PublishProcedureRequest {
  procedureInfo: PublishProcedureInfo;
  getTPFilesOnImport: boolean;
}
