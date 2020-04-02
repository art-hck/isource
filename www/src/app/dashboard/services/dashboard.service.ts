import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { DashboardMapMarkerItem } from "../models/dashboard-map-marker-item";

@Injectable()
export class DashboardService {

  constructor(protected api: HttpClient) {
  }

  getPositionStatusStatistic(): Observable<{status: string, count: number}[]> {
    const url = `requests/customer/dashboard/statistics/position-statuses`;
    return this.api.post<{status: string, count: number}[]>(url, {});
  }

  getBasisStatistic(): Observable<DashboardMapMarkerItem[]> {
    const url = `requests/customer/basis-percents`;
    return this.api.get<DashboardMapMarkerItem[]>(url);
  }

  getPositionMoneyStatistic(): Observable<Array<{status: string, price: number}>> {
    const url = `requests/customer/dashboard/statistics/position-prices`;
    return this.api.post<{status: string, price: number}[]>(url, {});
  }
}
