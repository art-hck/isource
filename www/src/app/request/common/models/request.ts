import {Uuid} from "../../../cart/models/uuid";
import {ContragentRegistration} from "../../../registration/models/contragent-registration";
import {UserRegistration} from "../../../registration/models/user-registration";
import {RequestDocument} from "./request-document";
import { BaseModel } from "../../../core/models/base-model";
import { DashboardInfo } from "./dashboard-info";

export class Request extends BaseModel {
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
