import {Uuid} from "../../../cart/models/uuid";
import {ContragentRegistration} from "../../../registration/models/contragent-registration";
import {UserRegistration} from "../../../registration/models/user-registration";
import {RequestDocument} from "./request-document";
import { DashboardInfo } from "./dashboard-info";

export class Request {
  contragent: ContragentRegistration;
  id: Uuid;
  contragentId: Uuid;
  createdDate: string;
  number: number;
  status: string;
  statusLabel: string;
  user: UserRegistration;
  documents?: RequestDocument[];
  comment?: string;
  type?: string;
  dashboard: DashboardInfo;
}
