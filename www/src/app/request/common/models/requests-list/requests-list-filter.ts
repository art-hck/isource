import { Uuid } from "../../../../cart/models/uuid";
import { PositionStatus } from "../../enum/position-status";

export class RequestsListFilter {
  requestNameOrNumber?: string;
  onlyOpenTasks?: boolean;
  customers?: Uuid[];
  positionStatuses?: PositionStatus[];
  shipmentDateFrom?: Date;
  shipmentDateTo?: Date;
  shipmentDateAsap?: boolean;
}

export type RequestsListFilterItem = RequestsListFilter[keyof RequestsListFilter];
