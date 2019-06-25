import {Uuid} from "../../../cart/models/uuid";

export class BackofficeRequest {
  id: Uuid;
  contragentId: Uuid;
  createdDate: string;
  number: number;
  status: string;
  statusLabel: string;
}
