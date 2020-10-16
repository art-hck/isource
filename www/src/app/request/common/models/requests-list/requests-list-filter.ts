import { Uuid } from "../../../../cart/models/uuid";
import { PositionStatus } from "../../enum/position-status";
import { RequestStatus } from "../../enum/request-status";
import { ChatContext } from "../../../../chat/models/chat-context";

export class RequestsListFilter {
  requestIds?: Uuid[];
  requestNameOrNumber?: string;
  onlyOpenTasks?: boolean;
  customers?: Uuid[];
  positionStatuses?: PositionStatus[];
  shipmentDateFrom?: string;
  shipmentDateTo?: string;
  shipmentDateAsap?: boolean;
  requestListStatusesFilter?: RequestStatus[];
  chatContexts?: ChatContext["id"][];
}
