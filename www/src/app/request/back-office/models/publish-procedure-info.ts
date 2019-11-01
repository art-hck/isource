import { Uuid } from 'src/app/cart/models/uuid';
import { RequestPosition } from '../../common/models/request-position';
import { RequestDocument } from '../../common/models/request-document';
import { ContragentList } from 'src/app/contragent/models/contragent-list';

export interface PublishProcedureInfo {
  requestId: Uuid,
  procedureInfo: any, // TODO: 2019-10-30 Определить правильно тип
  procedureProperties: any, // TODO: 2019-10-30 Определить правильно тип
  selectedProcedurePositions: RequestPosition[],
  selectedProcedureDocuments: RequestDocument[],
  selectedProcedureLotDocuments: RequestDocument[],
  selectedPrivateAccessContragents: ContragentList[]
}
