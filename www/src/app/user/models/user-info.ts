import { Uuid } from "../../cart/models/uuid";
import { Contragent } from "../../core/models/contragent";
import { Permission } from "../../auth/models/permission";
import { UsersGroup } from "../../core/models/users-group";

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
  isSystemAdmin: boolean;
  isContragentCreator: boolean;
  isCustomerApprover: boolean;
  permissions: Permission[];
  groups: UsersGroup[];

}


