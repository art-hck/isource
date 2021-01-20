import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { DashboardTasks } from "../../back-office/models/dashboard-tasks";

@Injectable()
export class DashboardService {

  constructor(protected api: HttpClient) {
  }
  getAgreements(filters = null, startFrom: number = 0, pageSize: number = 5) {
    const url = `requests/customer/tasks`;
    return this.api.post<DashboardTasks>(url, {startFrom, pageSize, filters});
  }
}
