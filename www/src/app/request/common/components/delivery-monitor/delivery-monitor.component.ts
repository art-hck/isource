import { Component, Input, OnInit } from '@angular/core';
import { RequestPosition } from "../../models/request-position";
import { DeliveryMonitorService } from "../../services/delivery-monitor.service";
import { DeliveryMonitorInfo } from "../../models/delivery-monitor-info";
import { ShipmentItem } from "../../models/shipment-item";
import * as moment from "moment";
import { Observable } from "rxjs";

@Component({
  selector: 'app-delivery-monitor',
  templateUrl: './delivery-monitor.component.html',
  styleUrls: ['./delivery-monitor.component.scss']
})
export class DeliveryMonitorComponent implements OnInit {

  @Input() requestPosition: RequestPosition;

  deliveryMonitorInfo$: Observable<DeliveryMonitorInfo>;

  goodId: string;
  demoGoodId = '61';

  constructor(
    private deliveryMonitorService: DeliveryMonitorService
  ) { }

  ngOnInit() {
    // используется захардкоженный id, в дальнейшем получать свой id для разных позиций
    this.goodId = this.demoGoodId;
    this.getDeliveryMonitorInfo();
  }

  getDeliveryMonitorInfo(): void {
    this.deliveryMonitorInfo$ =  this.deliveryMonitorService.getDeliveryMonitorInfo(this.goodId);
  }

}
