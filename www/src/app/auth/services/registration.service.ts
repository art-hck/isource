import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { UserRegistration } from "../../user/models/user-registration";
import { ContragentRegistration } from "../../contragent/models/contragent-registration";
import { Observable } from "rxjs";
import { ContragentShortInfo } from "../../contragent/models/contragent-short-info";
import { RegistrationRequest } from "../models/registration-request";

@Injectable()
export class RegistrationService {

  constructor(
    protected api: HttpClient
  ) {}

  registration(body: RegistrationRequest) {
    return this.api.post("registration", body);
  }

  /**
   * Проверяет был ли зарегистрирован ранее контрагент
   * @param inn
   * @param kpp
   */
  contragentExists(inn: string, kpp: string): Observable<ContragentShortInfo> {
    return this.api.post<ContragentShortInfo>('check-contragent-exists', {
      inn: inn,
      kpp: kpp
    });
  }
}
