import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RequestPosition } from "../../models/request-position";
import { RequestPositionStatusService } from "../../services/request-position-status.service";
import { RequestPositionWorkflowSteps } from "../../enum/request-position-workflow-steps";
import { UserInfoService } from "../../../../auth/services/user-info.service";
import { Uuid } from "../../../../cart/models/uuid";

@Component({
  selector: 'app-request-position',
  templateUrl: './request-position.component.html',
  styleUrls: ['./request-position.component.scss']
})
export class RequestPositionComponent {
  @Input() requestId: Uuid;
  @Input() position: RequestPosition;
  @Input() statuses: [string, string][];
  @Output() changeStatus = new EventEmitter<{ status, position }>();

  constructor(private positionStatusService: RequestPositionStatusService, public user: UserInfoService) {}

  isAfterManufacturing(position: RequestPosition): boolean {
    return this.positionStatusService.isStatusAfter(position.status, RequestPositionWorkflowSteps.MANUFACTURING);
  }
}
