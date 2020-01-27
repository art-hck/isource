import { Uuid } from "../../../../../cart/models/uuid";

export class EmployeeListItem {
  id:  Uuid;
  name: string;
  email: string;
  phone: string;
  requestsCount: number;
  positionsCount: number;
  lastActivity: string;
}
