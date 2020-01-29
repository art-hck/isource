import { UserListItem } from "./user-list-item";

export class UserList {
  purchasers: UserListItem[];
  managers: UserListItem[];

  constructor(params?: Partial<UserList>) {
    Object.assign(this, params);
  }
}