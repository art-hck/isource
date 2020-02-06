import { Component, Input } from '@angular/core';
import { RequestPosition } from "../../../models/request-position";
import { InspectorInfo } from "../../../models/inspector-info";
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
