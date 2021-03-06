import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { DashboardAvailableFilters } from "../../common/models/dashboard-available-filters";
import { DashboardTasks } from "../../common/models/dashboard-tasks";

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

  getDashboardAvailableFilters(filters = null) {
    const url = `requests/backoffice/dashboard/available-filters`;

    return this.api.post<DashboardAvailableFilters>(url, { filters });
  }
}
