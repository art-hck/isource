import { Component, OnInit } from '@angular/core';
import { Observable } from "rxjs";
import { Uuid } from "../../../../cart/models/uuid";
import { ActivatedRoute, Router } from "@angular/router";
import { RequestService } from "../../../customer/services/request.service";
import { map } from "rxjs/operators";
import { RequestPosition } from "../../models/request-position";
import { RequestPositionStatusService } from "../../services/request-position-status.service";
import { RequestPositionWorkflowSteps } from "../../enum/request-position-workflow-steps";

@Component({
  selector: 'app-request-position',
  templateUrl: './request-position.component.html',
  styleUrls: ['./request-position.component.scss']
})
export class RequestPositionComponent implements OnInit {

  requestId: Uuid;
  position$: Observable<RequestPosition>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private requestService: RequestService,
    private positionStatusService: RequestPositionStatusService
  ) {}

  ngOnInit() {
    this.requestId = this.route.snapshot.paramMap.get('id');
    this.position$ = this.requestService.getRequestPositionsFlat(this.requestService.getRequestPositions(this.requestId))
      .pipe(map(positions => positions[0] as RequestPosition));
  }

  isAfterManufacturing(position: RequestPosition): boolean {
    return this.positionStatusService.isStatusAfter(position.status, RequestPositionWorkflowSteps.MANUFACTURING);
  }

  nextStatus(position: RequestPosition) {
    position.status = this.positionStatusService.getNextStatus(position.status);
  }
}
