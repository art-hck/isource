import {Uuid} from "../../../cart/models/uuid";
import {UserRegistration} from "../../../auth/models/user-registration";
import {RequestDocument} from "./request-document";
import { BaseModel } from "../../../core/models/base-model";
import { DashboardInfo } from "./dashboard-info";
import { ContragentInfo } from "../../../contragent/models/contragent-info";

export class Request extends BaseModel {
  contragent: ContragentInfo;
  id: Uuid;
  name?: string;
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
  isOlderTwoWeeks?: boolean;
}
