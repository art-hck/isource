import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { DeliveryMonitorInfo, InspectorStage } from "../models/delivery-monitor-info";
import { Observable } from "rxjs";
import { Uuid } from "../../../cart/models/uuid";


@Injectable()
export class DeliveryMonitorService {

  constructor(
    protected api: HttpClient
  ) {
  }

  getDeliveryMonitorInfo(positionId: Uuid): Observable<DeliveryMonitorInfo> {
    return this.api.post<DeliveryMonitorInfo>(`monitor/goods/${positionId}`, null);
  }

  addInspectorStage(stage: InspectorStage): Observable<InspectorStage[]> {
    return this.api.post<InspectorStage[]>(`monitor/inspector-stages/add`, stage);
  }
}
