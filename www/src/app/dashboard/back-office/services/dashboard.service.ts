import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable()
export class DashboardService {

  constructor(protected api: HttpClient) {
  }

  getStatusesStatistics(filters = null): Observable<any> {
    const url = `requests/backoffice/dashboard/statistic`;

    return this.api.post<any>(url, { filters });
  }
}
