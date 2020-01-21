import { ContragentInfoBankRequisites } from "../../contragent/models/contragent-info-bank-requisites";
import { ContragentList } from "../../contragent/models/contragent-list";
import { ContragentInfoAddresses } from "../../contragent/models/contragent-info-address";
import { Uuid } from "../../cart/models/uuid";

export class RegistrationUserRequest {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  middleName: string;
  phone: string;
}

export class RegistrationUserWithContragentRequest extends RegistrationUserRequest {
  contragent: ContragentList;
  contragentAddress: ContragentInfoAddresses;
  contragentBankRequisite: ContragentInfoBankRequisites;
}

export class RegistrationUserWithContragentExistRequest extends RegistrationUserRequest {
  joinContragent: {
    id: Uuid
  };
}

export type RegistrationRequest = RegistrationUserWithContragentRequest | RegistrationUserWithContragentExistRequest;
