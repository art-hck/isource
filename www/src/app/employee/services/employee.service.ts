import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {EmployeeInfo, EmployeeInfoBrief} from "../models/employee-info";
import {EmployeeItem} from "../models/employee-item";
import {Uuid} from "../../cart/models/uuid";
import {ContragentRegistrationRequest} from "../../contragent/models/contragent-registration-request";
import {EmployeeRegistrationRequest} from "../models/employee-registration-request";
import {ContragentShortInfo} from "../../contragent/models/contragent-short-info";

@Injectable()
export class EmployeeService {

  loading = false;

  constructor(
    protected api: HttpClient
  ) {
  }

  getEmployeeList(type): Observable<EmployeeItem[]> {
    return this.api.post<EmployeeItem[]>(`requests/backoffice/users`, {role: type});
  }

  getEmployeeInfo(id: Uuid): Observable<EmployeeInfo> {
    return this.api.get<EmployeeInfo>(`requests/backoffice/users/${id}`);
  }

  createEmployee(employeeId: Uuid, employee: EmployeeInfoBrief) {
    return this.api.post<EmployeeInfoBrief>(`registration`, {
      "joinContragent": {
        "id": employeeId
      },
      "username": employee.username,
      "firstName": employee.firstName,
      "lastName": employee.lastName,
      "middleName": employee.middleName,
      "phone": employee.phone,
      "position": employee.position
    });
  }

  registerEmployee(employee: EmployeeInfoBrief) {
    return this.api.post<EmployeeItem>(`users/registration/backoffice`, {
      "username": employee.username,
      "role": employee.role,
      "firstName": employee.firstName,
      "lastName": employee.lastName,
      "middleName": employee.middleName,
      "phone": employee.phone,
      "position": employee.position,
    });
  }

  editEmployee(employee: EmployeeInfoBrief) {
    return this.api.post<EmployeeInfoBrief>(`users/edit/customer`, {
      userId: employee.id,
      ...employee
    });
  }

  getEmployeesList(contragentId: Uuid): Observable<EmployeeInfoBrief[]> {
    return this.api.post<EmployeeInfoBrief[]>(`users/employee-list`, {
      "contragentId": contragentId
    });
  }
}
