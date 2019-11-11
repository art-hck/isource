import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import { DeliveryMonitorInfo } from "../models/delivery-monitor-info";
import { ShipmentItem } from "../models/shipment-item";
import { Observable } from "rxjs";


@Injectable()
export class DeliveryMonitorService {

  constructor(
    protected api: HttpClient
  ) {
  }

  getDeliveryMonitorInfo(goodId): Observable<DeliveryMonitorInfo> {
    return this.api.get<DeliveryMonitorInfo>(`monitor/goods/${goodId}`);
  }

  getShipmentItems(goodId): Observable<ShipmentItem[]> {
    return this.api.get<ShipmentItem[]>(`monitor/goods/${goodId}/shipment-items`);
  }

  getShipmentItemInfo(goodId, shipmentItemId): Observable<ShipmentItem> {
    return this.api.get<ShipmentItem>(`monitor/goods/${goodId}/shipment-items/${shipmentItemId}`);
  }


}
