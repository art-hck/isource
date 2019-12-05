import { Component, OnInit } from '@angular/core';
import { RequestPositionWorkflowSteps } from "../../../request/common/enum/request-position-workflow-steps";

@Component({
  selector: 'uxg-guidlines',
  templateUrl: 'ux-guidlines.component.html',
  styleUrls: ['ux-guidlines.component.scss']
})

export class UxGuidlinesComponent {
  positionStatus = RequestPositionWorkflowSteps;
}
