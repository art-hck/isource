import { Uuid } from "../../../cart/models/uuid";
import { User } from "./user";
import { ActivityData } from "./history-activity-data";

export class History {
  createdDate: Date;
  type: string;
  typeLabel: string;
  data?: ActivityData;
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
}
