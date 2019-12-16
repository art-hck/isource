import { Component, Input } from '@angular/core';
import { RequestPositionWorkflowSteps } from "../../../request/common/enum/request-position-workflow-steps";

@Component({
  selector: 'uxg-position-status',
  templateUrl: './uxg-position-status.component.html'
})
export class UxgPositionStatusComponent {
  @Input() status: RequestPositionWorkflowSteps;
  @Input() label: string;
  @Input() count: number;
  @Input() textAlign: "left" | "right" = "right";
}
