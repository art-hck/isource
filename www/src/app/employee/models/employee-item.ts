import { Uuid } from "../../cart/models/uuid";

export class EmployeeItem {
  user: EmployeeInfo;
  posCount: number;
  reqCount: number;
}

class EmployeeInfo {
  id: Uuid;
  username: string;
  phone: string;
  firstName: string;
  lastName: string;
  middleName: string;
  fullName: string;
  shortName: string;
}
