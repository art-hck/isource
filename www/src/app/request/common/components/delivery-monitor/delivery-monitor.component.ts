import { Component, Input, OnInit } from '@angular/core';
import { RequestPosition } from "../../models/request-position";
import { DeliveryMonitorService } from "../../services/delivery-monitor.service";
import { DeliveryMonitorInfo } from "../../models/delivery-monitor-info";
import { ShipmentItem } from "../../models/shipment-item";
import * as moment from "moment";

@Component({
  selector: 'app-delivery-monitor',
  templateUrl: './delivery-monitor.component.html',
  styleUrls: ['./delivery-monitor.component.scss']
})
export class DeliveryMonitorComponent implements OnInit {

  @Input() requestPosition: RequestPosition;

  deliveryMonitorInfo: DeliveryMonitorInfo;

  goodId: string;

  constructor(
    private deliveryMonitorService: DeliveryMonitorService
  ) { }

  ngOnInit() {
    this.goodId = '61';
    this.getDeliveryMonitorInfo();
  }

  getDeliveryMonitorInfo(): void {
    const subscription = this.deliveryMonitorService
      .getDeliveryMonitorInfo(this.goodId)
      .subscribe(deliveryMonitorInfo => {
        this.deliveryMonitorInfo = deliveryMonitorInfo;
        subscription.unsubscribe();
      });
  }

  getShipmentItemsList(): ShipmentItem[] {
    return this.deliveryMonitorInfo.shipmentItems;
  }

  getShipmentItemCreatedDate(shipmentItem: ShipmentItem): string {
    const shipmentItemCreatedDate = shipmentItem.createdDate;
    return shipmentItemCreatedDate ? moment(shipmentItemCreatedDate).locale("ru").format('dd, DD.MM') : '—';
  }

  getShipmentItemShippingDate(shipmentItem: ShipmentItem): string {
    const shipmentItemShippingDate = shipmentItem.shipmentDate;
    return shipmentItemShippingDate ? moment(shipmentItemShippingDate).locale("ru").format('dd, DD.MM') : '—';
  }

  getShipmentItemArrivalDate(shipmentItem: ShipmentItem): string {
    return "Изменена c 28.08 на cб, 30.08" + shipmentItem;
  }


}
