import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { DashboardTasks } from "../models/dashboard-tasks";
import { Observable } from "rxjs";

@Injectable()
export class DashboardService {

  constructor(protected api: HttpClient) {
  }

  getTasks() {
    const url = `requests/backoffice/tasks`;
    return this.api.post<DashboardTasks>(url, {});
  }

  getAgreements() {
    const url = `requests/backoffice/tasks/agreements`;
    return this.api.post<DashboardTasks>(url, {});
  }

  getStatusesStatistics(filters = null): Observable<any> {
    const url = `requests/backoffice/dashboard/statistic`;

    return this.api.post<any>(url, { filters });
  }
}
