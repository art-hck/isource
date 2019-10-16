import { Uuid } from "../../cart/models/uuid";

export class ContragentList {
  id: Uuid|null;
  type: string;
  legalForm?: string;
  name: string;
  shortName: string;
  inn: string;
  kpp: string;
  ogrn: string;
  taxAuthorityRegistrationDate: Date;
  email: string;
  directorFullName: string;
  phone: string;
  createdDate: Date;

  constructor(params?: Partial<ContragentList>) {
    Object.assign(this, params);
  }
}
