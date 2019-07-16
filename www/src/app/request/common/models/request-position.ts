import {Uuid} from "../../../cart/models/uuid";
import {RequestItem} from "./request-item";
import { RequestDocument } from "./request-document";

export class RequestPosition extends RequestItem {
  /**
   * Значение null допустимо для позиций не сохранённых в базе данных
   */
  id: Uuid|null;
  userId: Uuid;
  contragentId: Uuid;
  createdDate: string;
  number: number;
  status: string;
  requestId: Uuid;
  statusChangedDate: string;
  statusExpectedDate: string;
  type: string;
  statusLabel: string;
  documents: RequestDocument[];
}
