import {PositionsListItem} from "./positions-list-item";
import {CustomerInfo} from "./customer-info";
import {RequestListItem} from "./requests-list-item";

export class RequestsList {
  request: RequestListItem;
  customer?: CustomerInfo;
  positions: PositionsListItem[];
  positionsCount?: number;
}
