import { RequestPosition } from '../../common/models/request-position';
import { ProcedureInfo } from './procedure-info';

export interface ProcedureBasicDataPage {
  selectedProcedurePositions: RequestPosition[];
  procedureInfo: ProcedureInfo;
}
