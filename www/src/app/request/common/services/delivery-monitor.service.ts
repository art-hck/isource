import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { DeliveryMonitorInfo, InspectorStage } from "../models/delivery-monitor-info";
import { Observable, of } from "rxjs";
import { Uuid } from "../../../cart/models/uuid";
import { InspectorInfo } from "../models/inspector-info";
import { MonitorMock } from "./delivery-monitor.mock";
import { InspectorMock } from "./inspector.mock";
import { GoodsMock } from "./goods.mock";


@Injectable()
export class DeliveryMonitorService {

  constructor(
    protected api: HttpClient
  ) {
  }

  getDeliveryMonitorInfo(positionId: Uuid): Observable<DeliveryMonitorInfo> {
    return this.api.post<DeliveryMonitorInfo>(`monitor/goods/${positionId}`, null);
    // return of(MonitorMock);
  }

  getInspectorInfo(positionId: Uuid): Observable<InspectorInfo[]> {
    return this.api.post<InspectorInfo[]>(`monitor/goods/${positionId}/production`, null);
    // return of(InspectorMock);
  }

  getInspectorStages(positionId: Uuid): Observable<DeliveryMonitorInfo> {
    return this.api.post<DeliveryMonitorInfo>(`monitor/goods/${positionId}/production-schedules`, null);
    // return of(GoodsMock);
  }

  addInspectorStage(stage: InspectorStage): Observable<InspectorStage[]> {
    return this.api.post<InspectorStage[]>(`monitor/inspector-stages/add`, stage);
  }

  assignNewGoodId(positionId: string, newGoodId): Observable<void> {
    return this.api.post<void>(`monitor/goods/${positionId}/replace-good-id`, newGoodId);
  }
}
