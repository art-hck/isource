import { Uuid } from "../../../cart/models/uuid";
import { User } from "../../../user/models/user";
import { ActivityData } from "./history-activity-data";
import { PositionHistoryTypes } from "../enum/position-history-types";
import { RequestPositionWorkflowSteps } from "../enum/request-position-workflow-steps";

export class History {
  createdDate: string;
  type: PositionHistoryTypes;
  typeLabel: string;
  data: ActivityData;
  documentId?: string;
  id: Uuid;
  requestContractId?: Uuid;
  requestId: Uuid;
  requestOfferPositionId?: Uuid;
  requestOfferPositionWinnerId?: Uuid;
  requestPositionId: Uuid;
  status?: string;
  statusLabel?: string;
  user?: User;
  request?: {
    id: Uuid
    name: string
    number: number
  };
  requestPosition?: {
    id: Uuid
    name: string
    status: RequestPositionWorkflowSteps
  };
}
