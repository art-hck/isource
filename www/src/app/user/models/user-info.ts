import {Uuid} from "../../cart/models/uuid";
import { Contragent } from "../../core/models/contragent";

export class UserInfo {
  id: Uuid;
  contragentId: Uuid;
  contragent: Contragent;
  username: string;
  firstName: string;
  lastName: string;
  middleName: string;
  isCustomer: boolean;
  isBackOffice: boolean;
  isSupplier: boolean;
  isAdmin: boolean;
  isCustomerBuyer: boolean;
  isBackofficeBuyer: boolean;
  isSeniorBackoffice: boolean;
  isContragentCreator: boolean;
}


