import { Uuid } from "../../cart/models/uuid";

export class EmployeeItemInfo {
  id: Uuid;
  username: string;
  phone: string;
  firstName: string;
  lastName: string;
  middleName: string;
  fullName: string;
  shortName: string;
}
