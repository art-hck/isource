import { Uuid } from 'src/app/cart/models/uuid';
import { RequestPosition } from '../../common/models/request-position';
import { RequestDocument } from '../../common/models/request-document';
import { ContragentList } from 'src/app/contragent/models/contragent-list';
import { ProcedureProperties } from './procedure-properties';
import { ProcedureInfo } from './procedure-info';

export interface PublishProcedureInfo {
  requestId: Uuid;
  procedureInfo: ProcedureInfo;
  procedureProperties: ProcedureProperties;
  selectedProcedurePositions: RequestPosition[];
  selectedProcedureDocuments: RequestDocument[];
  selectedProcedureLotDocuments: RequestDocument[];
  selectedPrivateAccessContragents: ContragentList[];
}
