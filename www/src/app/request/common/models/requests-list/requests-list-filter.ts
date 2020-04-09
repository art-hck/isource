import { Uuid } from "../../../../cart/models/uuid";
import { PositionStatus } from "../../enum/position-status";
import { RequestStatus } from "../../enum/request-status";

export class RequestsListFilter {
  requestNameOrNumber?: string;
  onlyOpenTasks?: boolean;
  customers?: Uuid[];
  positionStatuses?: PositionStatus[];
  shipmentDateFrom?: Date;
  shipmentDateTo?: Date;
  shipmentDateAsap?: boolean;
  requestListStatusesFilter?: RequestStatus[];
}
