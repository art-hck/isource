import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { RegistrationRequest } from "../models/registration-request";

@Injectable()
export class RegistrationService {

  constructor(protected api: HttpClient) {}

  registration(body: RegistrationRequest) {
    return this.api.post("registration", body);
  }
}
