import { Component, HostListener, Input } from '@angular/core';
import { NotificationService } from "../../../../../shared/services/notification.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { RequestPosition } from "../../../models/request-position";
import { DeliveryMonitorService } from "../../../services/delivery-monitor.service";
import { InspectorInfo } from "../../../models/inspector-info";
import { InspectorStatus } from "../../../enum/inspector-status";
import { InspectorStatusLabels } from "../../../dictionaries/inspector-status-labels";

@Component({
  selector: 'app-digital-inspector',
  templateUrl: 'digital-inspector.component.html',
  styleUrls: ['digital-inspector.component.scss']
})

export class DigitalInspectorComponent {

  @Input() inspectorStages: InspectorInfo[];
  @Input() position: RequestPosition;

  getEventTitleByType(type) {
    return InspectorStatusLabels[type];
  }
}
