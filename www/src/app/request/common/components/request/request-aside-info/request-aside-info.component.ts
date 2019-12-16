import { Component, Input } from '@angular/core';
import { RequestPosition } from "../../../models/request-position";
import { RequestPositionWorkflowStepsGroupsInfo } from "../../../enum/request-position-workflow-steps";
import { Request } from "../../../models/request";

@Component({
  selector: 'app-request-aside-info',
  templateUrl: 'request-aside-info.component.html'
})

export class RequestAsideInfoComponent {
  @Input() positions: RequestPosition[];
  @Input() request: Request;
  isInfoTabVisible: boolean;
  isStatTabVisible: boolean;

  getStatusCounters(positions: RequestPosition[]) {
    return RequestPositionWorkflowStepsGroupsInfo.filter(statusCounter => (
      statusCounter.hasActions
    )).map(statusCounter => ({
        ...statusCounter,
        positions: positions.filter(position => statusCounter.statuses.indexOf(position.status) >= 0)
      })
    );
  }
}
