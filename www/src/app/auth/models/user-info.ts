import {Uuid} from "../../cart/models/uuid";
import { Contragent } from "../../core/models/contragent";

export class UserInfo {
  id: Uuid;
  contragentId: Uuid;
  contragent: Contragent;
  username: string;
  firstName: string;
  lastName: string;
  isSupplier: boolean;
  isCustomer: boolean;
  isBackOffice: boolean;
  isSeniorBackoffice: boolean;
  isRegularBackoffice: boolean;
}


