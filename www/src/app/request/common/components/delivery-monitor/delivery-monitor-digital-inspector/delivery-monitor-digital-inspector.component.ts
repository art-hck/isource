import { Component, Input, OnInit } from '@angular/core';
import { RequestPosition } from "../../../models/request-position";
import { InspectorInfo } from "../../../models/inspector-info";
import { InspectorStatusLabels } from "../../../dictionaries/inspector-status-labels";
import { DeliveryMonitorService } from "../../../services/delivery-monitor.service";
import { DeliveryMonitorInfo } from "../../../models/delivery-monitor-info";

@Component({
  selector: 'app-request-delivery-monitor-digital-inspector',
  templateUrl: 'delivery-monitor-digital-inspector.component.html',
  styleUrls: ['delivery-monitor-digital-inspector.component.scss']
})

export class DeliveryMonitorDigitalInspectorComponent implements OnInit {

  @Input() position: RequestPosition;

  inspectorStages: InspectorInfo[];
  productStages: DeliveryMonitorInfo;

  constructor(public deliveryMonitorService: DeliveryMonitorService) {}

  ngOnInit() {
    this.getInspectorStagesInfo();
    this.getInspectorStages();
  }

  getInspectorStagesInfo(): void {
    const subscription = this.deliveryMonitorService.getInspectorInfo(this.position.id).subscribe(
      data => {
        this.inspectorStages = data;
        subscription.unsubscribe();
      });
  }

  getInspectorStages(): void {
    const subscription = this.deliveryMonitorService.getInspectorStages(this.position.id).subscribe(
      data => {
        this.productStages = data;
        subscription.unsubscribe();
      });
  }

  getEventTitleByType(type) {
    return InspectorStatusLabels[type];
  }
}
