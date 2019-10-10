import { Uuid } from "../../cart/models/uuid";

export class ContragentInfo {
  id: Uuid;
  fullName: string;
  shortName: string;
  inn: string;
  kpp: string;
  ogrn: string;
  checkedDate: string;
  contragentEmail: string;
  contragentPhone: string;
  country: string;
  area: string;
  city: string;
  address: string;
  index: number;
  town?: string;
  bankAccount: string;
  corrAccount: string;
  bik: string;
  bankName: string;
  bankAddress: string;
}
