import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {UserRegistration} from "../models/user-registration";
import {ContragentRegistration} from "../models/contragent-registration";

@Injectable()
export class RegistrationService {

  constructor(
    protected api: HttpClient
  ) {
  }
registration(userRegistration: UserRegistration, contragentRegistration: ContragentRegistration) {
    return this.api.post(
      `/supplier-price-list`,
      {
        username: userRegistration.username,
        password: userRegistration.password,
        firstName: userRegistration.firstName,
        lastName: userRegistration.lastName,
        middleName: userRegistration.middleName,
        phone: userRegistration.phone,
        contragent: {
          fullName: contragentRegistration.fullName,
          shortName: contragentRegistration.shortName,
          inn: contragentRegistration.inn,
          kpp: contragentRegistration.kpp,
          ogrn: contragentRegistration.ogrn,
          taxAuthorityRegistrationDate: contragentRegistration.taxAuthorityRegistrationDate,
          email: contragentRegistration.email,
          phone: contragentRegistration.phone
        },
        contragentAddress: {
          country: contragentRegistration.country,
          region: contragentRegistration.region,
          city: contragentRegistration.city,
          address: contragentRegistration.address,
          postIndex: contragentRegistration.postIndex,
          locality: contragentRegistration.locality
        },
        contragentBankRequisite: {
          account: contragentRegistration.account,
          correspondentAccount: contragentRegistration.correspondentAccount,
          bik: contragentRegistration.bik,
          name: contragentRegistration.name,
          address: contragentRegistration.bankAddress
        }
      });
  }

}
