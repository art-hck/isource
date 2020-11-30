import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { DashboardMapItem } from "../models/dashboard-map-item";

@Injectable()
export class DashboardMapService {

  constructor(protected api: HttpClient) {}

  search(address: string): Observable<DashboardMapItem[]> {
    const url = `https://nominatim.openstreetmap.org/search?q=${address}&format=json`;
    return this.api.get<DashboardMapItem[]>(url);
  }
}
