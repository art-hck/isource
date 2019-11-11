import { Component, Input, OnChanges, OnInit } from '@angular/core';
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

  awaitingCount: number;
  inProductionCount: number;
  loadingCount: number;
  inTransitCount: number;
  deliveredCount: number;

  constructor() { }

  ngOnChanges() {
    if (this.deliveryMonitorInfo) {
      this.getGoodItemCounters();

      this.totalCount =
        this.awaitingCount +
        this.inProductionCount +
        this.loadingCount +
        this.inTransitCount +
        this.deliveredCount;
    }
  }

  getGoodItemCounters() {
    this.awaitingCount = this.deliveryMonitorInfo.statusMtr.awaiting;
    this.inProductionCount = this.deliveryMonitorInfo.statusMtr.inProduction;
    this.loadingCount = this.deliveryMonitorInfo.statusMtr.loading;
    this.inTransitCount = this.deliveryMonitorInfo.statusMtr.inTransit;
    this.deliveredCount = this.deliveryMonitorInfo.statusMtr.delivered;
  }

  getUpdatedDate() {
    return "сегодня, 17:00";
  }

  getProgressWidth(countParam): string {
    const percent = (countParam / this.totalCount) * 100 ;
    return percent + "%";
  }

  getProgressCountLabel(countParam): string {
    return countParam + ' ' + this.deliveryMonitorInfo.material.basicUnitMeasureAei;
  }
}
