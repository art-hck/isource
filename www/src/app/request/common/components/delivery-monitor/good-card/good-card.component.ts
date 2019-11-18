import { Component, Input, OnChanges } from '@angular/core';
import { DeliveryMonitorInfo } from "../../../models/delivery-monitor-info";
import { RequestPosition } from "../../../models/request-position";

@Component({
  selector: 'app-good-card',
  templateUrl: './good-card.component.html',
  styleUrls: ['./good-card.component.scss']
})
export class GoodCardComponent implements OnChanges {

  @Input() requestPosition: RequestPosition;
  @Input() deliveryMonitorInfo: DeliveryMonitorInfo;

  totalCount: number;

  constructor() { }

  ngOnChanges() {
    if (this.deliveryMonitorInfo) {
      this.totalCount =
        this.deliveryMonitorCounters.awaiting +
        this.deliveryMonitorCounters.inProduction +
        this.deliveryMonitorCounters.loading +
        this.deliveryMonitorCounters.inTransit +
        this.deliveryMonitorCounters.delivered;
    }
  }

  get deliveryMonitorCounters() {
    return this.deliveryMonitorInfo.statusMtr;
  }

  // todo переделать, когда будут готовы партии
  getUpdatedDate() {
    const date = new Date();
    date.setHours(date.getHours() - 2);
    return "сегодня, " + date.getHours() + ":" + "00";
  }

  getProgressWidth(countParam): number {
    return (countParam / this.totalCount) * 100;
  }

  getProgressCountLabel(countParam): string {
    return countParam + ' ' + this.deliveryMonitorInfo.material.basicUnitMeasureAei;
  }
}
