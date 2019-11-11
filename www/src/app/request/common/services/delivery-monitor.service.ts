import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import { DeliveryMonitorInfo } from "../models/delivery-monitor-info";
import { ShipmentItem } from "../models/shipment-item";


@Injectable()
export class DeliveryMonitorService {

  constructor(
    protected api: HttpClient
  ) {
  }

  getDeliveryMonitorInfo(goodId) {
    return this.api.get<DeliveryMonitorInfo>(`monitor/goods/${goodId}`);
  }

  getShipmentItemInfo(positionId, shipmentItemId) {
    return this.api.get<ShipmentItem>(`requests/positions/${positionId}/shipment-item-info/${shipmentItemId}`);
  }


}
