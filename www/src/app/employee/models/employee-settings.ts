import { Uuid } from "../../cart/models/uuid";
import { User } from "../../user/models/user";

export class EmployeeSettings {
  userId: Uuid;
  isInternalAvailable: boolean;
  isExternalAvailable: boolean;
  user: User;
}

