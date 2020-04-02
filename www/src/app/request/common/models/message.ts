import { Uuid } from "../../../cart/models/uuid";
import { User } from "../../../user/models/user";
import { RequestDocument } from "./request-document";
import { Contragent } from "../../../core/models/contragent";

export class Message {
  id?: Uuid;
  user?: User;
  contragent?: Contragent;
  createdDate?: string;
  message: string;
  documents?: RequestDocument[];
  requestPositionId?: Uuid;
  isSending?: boolean;
  contextType: string;
  contextId: Uuid;
  requestId: Uuid;
}
