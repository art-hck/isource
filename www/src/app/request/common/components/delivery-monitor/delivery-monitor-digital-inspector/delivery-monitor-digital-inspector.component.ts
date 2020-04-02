import { Component, Input } from '@angular/core';
import { RequestPosition } from "../../../models/request-position";
import { InspectorInfo } from "../../../models/inspector-info";
import { InspectorStatusLabels } from "../../../dictionaries/inspector-status-labels";

@Component({
  selector: 'app-request-delivery-monitor-digital-inspector',
  templateUrl: 'delivery-monitor-digital-inspector.component.html',
  styleUrls: ['delivery-monitor-digital-inspector.component.scss']
})

export class DeliveryMonitorDigitalInspectorComponent {

  @Input() inspectorStages: InspectorInfo[];
  @Input() position: RequestPosition;

  getEventTitleByType(type) {
    return InspectorStatusLabels[type];
  }
}
