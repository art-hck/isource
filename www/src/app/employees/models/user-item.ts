import { Uuid } from "../../cart/models/uuid";

export class UserItem {
  user: UserInfo;
  posCount: number;
  reqCount: number;
}

class UserInfo {
  id: Uuid;
  username: string;
  phone: string;
  firstName: string;
  lastName: string;
  middleName: string;
  fullName: string;
  shortName: string;
}
