import { Component } from '@angular/core';
import { RequestPositionWorkflowSteps } from "../../../../request/common/enum/request-position-workflow-steps";

@Component({
  selector: 'uxg-example-position-status',
  templateUrl: './uxg-example-position-status.component.html'
})
export class UxgExamplePositionStatusComponent {
  positionStatus = RequestPositionWorkflowSteps;
  readonly example1 = `<uxg-position-status label="Черновик" [status]="positionStatus.DRAFT"></uxg-position-status>`;
  readonly example2 = `<div class="app-row">
  <div class="app-col">Согласование ТП</div>
  <div class="app-col text-right">
    <div class="app-position-status">
      <span>14</span>
      <div class="app-position-status-icon TECHNICAL_PROPOSALS_AGREEMENT"></div>
    </div>
  </div>
</div>`;

}
