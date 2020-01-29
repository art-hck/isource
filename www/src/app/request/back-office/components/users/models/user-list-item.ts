import { Uuid } from "../../../../../cart/models/uuid";

export class UserListItem {
  user: UserInfo;
  poscount: number;
  reqcount: number;
}

class UserInfo {
  id: Uuid;
  username: string;
  firstName: string;
  lastName: string;
  middleName: string;
  fullName: string;
  shortName: string;
}
