import { Uuid } from "../../../../cart/models/uuid";

export class RequestsListFilter {
  requestNameOrNumber: string;
  onlyOpenTasks: boolean;
  customers: Uuid[];
  shipmentDateFrom: Date;
  shipmentDateTo: Date;
  shipmentDateAsap: boolean;
}
