import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from "rxjs";
import { Uuid } from "../../../../cart/models/uuid";
import { ActivatedRoute, Router } from "@angular/router";
import { RequestService } from "../../../customer/services/request.service";
import { RequestService as BackofficeRequestService } from "../../../back-office/services/request.service";
import { RequestPosition } from "../../models/request-position";
import { RequestPositionStatusService } from "../../services/request-position-status.service";
import { RequestPositionWorkflowSteps } from "../../enum/request-position-workflow-steps";
import { RequestPositionWorkflowStepLabels } from "../../dictionaries/request-position-workflow-step-labels";

@Component({
  selector: 'app-request-position',
  templateUrl: './request-position.component.html',
  styleUrls: ['./request-position.component.scss']
})
export class RequestPositionComponent implements OnInit, OnDestroy {

  requestId: Uuid;
  positionId: Uuid;
  position$: Observable<RequestPosition>;
  statuses = Object.entries(RequestPositionWorkflowStepLabels);
  subsription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private requestService: RequestService,
    private backofficeRequestService: BackofficeRequestService,
    private positionStatusService: RequestPositionStatusService
  ) {}

  ngOnInit() {
    this.requestId = this.route.snapshot.paramMap.get('id');
    this.positionId = this.route.snapshot.paramMap.get('position-id');
    this.position$ = this.requestService.getRequestPosition(this.positionId);
  }

  isAfterManufacturing(position: RequestPosition): boolean {
    return this.positionStatusService.isStatusAfter(position.status, RequestPositionWorkflowSteps.MANUFACTURING);
  }

  nextStatus(position: RequestPosition) {
    position.status = this.positionStatusService.getNextStatus(position.status);
  }

  changeStatus(status, position) {
    position.statusLabel = status.label;
    position.status = status.value;

    this.subsription.add(
      this.backofficeRequestService.changeStatus(this.requestId, position.id, position.status).subscribe()
    );
  }

  ngOnDestroy() {
    this.subsription.unsubscribe();
  }
}
