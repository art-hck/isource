import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {UserRegistration} from "../models/user-registration";
import {ContragentRegistration} from "../models/contragent-registration";

@Injectable()
export class RegistrationService {

  constructor(
    protected api: HttpClient
  ) {}

  registration(userRegistration: UserRegistration, contragentRegistration: ContragentRegistration) {
    return this.api.post(
      `registration`,
      {
        username: userRegistration.email,
        password: userRegistration.password,
        firstName: userRegistration.firstName,
        lastName: userRegistration.lastName,
        middleName: userRegistration.secondName,
        phone: userRegistration.phone.toString(),
        contragent: {
          fullName: contragentRegistration.fullName,
          shortName: contragentRegistration.shortName,
          inn: contragentRegistration.inn.toString(),
          kpp: contragentRegistration.kpp.toString(),
          ogrn: contragentRegistration.ogrn.toString(),
          taxAuthorityRegistrationDate: contragentRegistration.checkedDate,
          email: contragentRegistration.contragentEmail,
          phone: contragentRegistration.contragentPhone.toString(),
        },
        contragentAddress: {
          country: contragentRegistration.country,
          region: contragentRegistration.area,
          city: contragentRegistration.city,
          address: contragentRegistration.address,
          postIndex: contragentRegistration.index.toString(),
          locality: contragentRegistration.town
        },
        contragentBankRequisite: {
          account: contragentRegistration.bankAccount.toString(),
          correspondentAccount: contragentRegistration.corrAccount.toString(),
          bik: contragentRegistration.bik.toString(),
          name: contragentRegistration.bankName,
          address: contragentRegistration.bankAddress
        }
      });
  }

}
