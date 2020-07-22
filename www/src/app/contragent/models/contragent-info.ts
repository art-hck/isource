import { Uuid } from "../../cart/models/uuid";
import { ContragentInfoAddresses } from "./contragent-info-address";
import { ContragentInfoBankRequisites } from "./contragent-info-bank-requisites";
import {User} from "../../user/models/user";

export class ContragentInfo {
  id: Uuid;
  type: string;
  legalForm?: string;
  fullName: string;
  shortName: string;
  inn: string;
  kpp: string;
  ogrn: string;
  isInternal: boolean;
  taxAuthorityRegistrationDate?: Date;
  email: string;
  directorFullName?: string;
  phone: string;
  createdDate: Date;
  updatedDate: Date;
  addresses?: ContragentInfoAddresses[];
  bankRequisites?: ContragentInfoBankRequisites[];
  responsible?: User;

}
