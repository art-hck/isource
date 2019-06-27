import {Uuid} from "../../../cart/models/uuid";
import {ContragentRegistration} from "../../../registration/models/contragent-registration";
import {UserRegistration} from "../../../registration/models/user-registration";

export class Request {
  contragent: ContragentRegistration;
  id: Uuid;
  contragentId: Uuid;
  createdDate: string;
  number: number;
  status: string;
  statusLabel: string;
  user: UserRegistration;
}
