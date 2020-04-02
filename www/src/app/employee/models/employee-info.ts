import { Uuid } from "../../cart/models/uuid";
import { EmployeeListRequestPosition } from "./employee-list-request-position";
import { RequestListItem } from "../../request/common/models/requests-list/requests-list-item";

export class EmployeeInfo {
  requests: EmployeeInfoRequestItem[];
  positions: EmployeeListRequestPosition[];
  user: EmployeeInfoBrief;

  constructor(params?: Partial<EmployeeInfo>) {
    Object.assign(this, params);
  }
}

export class EmployeeInfoRequestItem {
  request: RequestListItem;
  completedCount: number;
  positionCount: number;
}

export class EmployeeInfoBrief {
  id: Uuid;
  firstName: string;
  fullName: string;
  lastName: string;
  middleName: string;
  phone: string;
  shortName: string;
  username: string;
  position: string;
}
