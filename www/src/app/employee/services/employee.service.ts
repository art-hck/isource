import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import {EmployeeInfo, EmployeeInfoBrief} from "../models/employee-info";
import { EmployeeItem } from "../models/employee-item";
import { Uuid } from "../../cart/models/uuid";

@Injectable()
export class EmployeeService {

  loading = false;

  constructor(
    protected api: HttpClient
  ) {
  }

  getEmployeeList(type): Observable<EmployeeItem[]> {
    return this.api.post<EmployeeItem[]>(`requests/backoffice/users`, { role: type });
  }

  getEmployeeInfo(id: Uuid): Observable<EmployeeInfo> {
    return this.api.get<EmployeeInfo>(`requests/backoffice/users/${id}`);
  }

  createEmployee(contragentId: Uuid, employee: EmployeeInfoBrief) {
    return this.api.post(`registration`, {
      "joinContragent":{
        "id": contragentId
      },
      "username": employee.username,
      "firstName": employee.firstName,
      "lastName": employee.lastName,
      "middleName": employee.middleName,
      "phone": employee.phone,
      "position":employee.position
    })
  }
}
