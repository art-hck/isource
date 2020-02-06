import { Uuid } from "../../cart/models/uuid";
import { UserListRequestPosition } from "../../request/common/models/user-list-request-position";
import { RequestListItem } from "../../request/common/models/requests-list/requests-list-item";

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
