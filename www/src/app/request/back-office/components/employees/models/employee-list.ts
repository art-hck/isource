import { EmployeeListItem } from "./employee-list-item";

export class EmployeeList {
  purchasers: EmployeeListItem[];
  managers: EmployeeListItem[];

  constructor(params?: Partial<EmployeeList>) {
    Object.assign(this, params);
  }
}