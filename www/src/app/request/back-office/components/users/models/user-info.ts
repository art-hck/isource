import { RequestListItem } from "../../../../common/models/requests-list/requests-list-item";
import { Uuid } from "../../../../../cart/models/uuid";
import { UserListRequestPosition } from "../../../../common/models/user-list-request-position";

export class UserInfo {
  requests: UserInfoRequestItem[];
  positions: UserListRequestPosition[];
  user: UserInfoBrief;

  constructor(params?: Partial<UserInfo>) {
    Object.assign(this, params);
  }
}

export class UserInfoRequestItem {
  request: RequestListItem;
  completedCount: number;
  positionCount: number;
}

export class UserInfoBrief {
  id: Uuid;
  firstName: string;
  fullName: string;
  lastName: string;
  middleName: string;
  phone: string;
  shortName: string;
  username: string;
}
