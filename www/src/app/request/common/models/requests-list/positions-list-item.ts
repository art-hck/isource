import {Uuid} from "../../../../cart/models/uuid";
import {StatusInfo} from "./status-info";

export class PositionsListItem {
  id: Uuid;
  name: string;
  quantity: number;
  measureUnit: string;
  status: StatusInfo;
}
