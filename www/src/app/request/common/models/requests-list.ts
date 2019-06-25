import {Uuid} from "../../../cart/models/uuid";

export class RequestsList {
  request: RequestListItem;
  customer?: CustomerInfo;
  positions: PositionsListItem[];
  positionsCount?: number;
}


class RequestListItem {
  id: Uuid;
  number: number;
  status: StatusInfo;
  delivery: DeliveryInfo;
}

class CustomerInfo {
  id: Uuid;
  name: string;
}

class PositionsListItem {
  id: Uuid;
  name: string;
  quantity: number;
  measureUnit: string;
  status: StatusInfo;
}

class StatusInfo {
  name: string;
  label: string;
}

class DeliveryInfo {
  value?: Date;
  from?: Date;
  to?: Date;
  asap?: boolean;
}

