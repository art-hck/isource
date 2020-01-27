import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { EmployeeList } from "../models/employee-list";
import { Uuid } from "../../../../../cart/models/uuid";
import { EmployeeListItem } from "../models/employee-list-item";

@Injectable()
export class EmployeesService {

  loading = false;

  constructor(
    protected api: HttpClient
  ) {
  }

  getEmployeeList(): Observable<EmployeeList[]> {
    return this.api.post<EmployeeList[]>(`staff`, {});
  }

  getEmployeeInfo(id: Uuid): Observable<EmployeeListItem> {
    return this.api.get<EmployeeListItem>(`staff/${id}/info`);
  }
}
