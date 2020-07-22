import {Uuid} from "../../../../cart/models/uuid";
import {StatusInfo} from "./status-info";
import {DeliveryInfo} from "./delivery-info";
import { Contragent } from "../../../../core/models/contragent";
import { Conversation } from "../../../../message/models/conversation";

export class RequestListItem {
  id: Uuid;
  name?: string;
  number: number;
  status: StatusInfo;
  delivery?: DeliveryInfo;
  type?: string;
  comment?: string;
  contragent?: Contragent;
  publishedDate?: Date;
  conversation?: { id: Uuid, externalId: Conversation["id"] };
}
