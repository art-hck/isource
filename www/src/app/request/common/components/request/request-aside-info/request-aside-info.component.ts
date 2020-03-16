import { Component, Input } from '@angular/core';
import { RequestPosition } from "../../../models/request-position";
import { Request } from "../../../models/request";
import { PositionStatusesGroupsInfo } from "../../../dictionaries/position-statuses-groups-info";

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
    return PositionStatusesGroupsInfo.filter(statusCounter => (
      statusCounter.hasActions
    )).map(statusCounter => ({
        ...statusCounter,
        positions: positions.filter(position => statusCounter.statuses.indexOf(position.status) >= 0)
      })
    );
  }
}
