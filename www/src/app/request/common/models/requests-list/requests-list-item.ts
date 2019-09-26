import {Uuid} from "../../../../cart/models/uuid";
import {StatusInfo} from "./status-info";
import {DeliveryInfo} from "./delivery-info";
import { Contragent } from "../../../../core/models/contragent";

export class RequestListItem {
  id: Uuid;
  number: number;
  status: StatusInfo;
  delivery?: DeliveryInfo;
  type?: string;
  comment?: string;
  contragent?: Contragent;
}
