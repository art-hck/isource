import { Component, OnInit, ViewChild } from '@angular/core';
import { Uuid } from "../../../../cart/models/uuid";
import { Request } from "../../../common/models/request";
import { RequestPosition } from "../../../common/models/request-position";
import { ActivatedRoute } from "@angular/router";
import { RequestService } from "../../services/request.service";
import { RequestViewComponent } from 'src/app/request/common/components/request-view/request-view.component';
import { RequestWorkflowSteps } from "../../../common/enum/request-workflow-steps";
import { RequestPositionWorkflowSteps } from "../../../common/enum/request-position-workflow-steps";

@Component({
  selector: 'app-customer-request-view',
  templateUrl: './customer-request-view.component.html',
  styleUrls: ['./customer-request-view.component.css']
})
export class CustomerRequestViewComponent implements OnInit {
  @ViewChild(RequestViewComponent, {static: false}) requestView: RequestViewComponent;

  request: Request;
  updatedPosition: RequestPosition;
  requestPositions: RequestPosition[];

  protected requestId: Uuid;

  constructor(
    private route: ActivatedRoute,
    private requestService: RequestService
  ) {
  }

  ngOnInit() {
    this.requestId = this.route.snapshot.paramMap.get('id');

    this.getRequest();
    this.getRequestPositions();
  }

  protected getRequest(): void {
    this.requestService.getRequestInfo(this.requestId).subscribe(
      (request: Request) => {
        this.request = request;
      }
    );
  }

  protected getRequestPositions(): void {
    this.requestService.getRequestPositions(this.requestId).subscribe((requestPositions) => {
      this.requestPositions = requestPositions;
    });
  }

  canPublish(): boolean {
    if (!this.request) {
      return false;
    }

    if (!this.requestPositions) {
      return false;
    }

    if (this.request.status === RequestWorkflowSteps.DRAFT) {
      return true;
    }

    for (const position of this.requestPositions) {
      if (position.status === RequestPositionWorkflowSteps.DRAFT) {
        return true;
      }
    }

    return false;
  }

  onPublish(): void {
    this.requestService.publishRequest(this.requestId).subscribe(
      (data: any) => {
        this.requestView.showPositionInfo = null;
        this.getRequest();
        this.getRequestPositions();
      }
    );
  }
}
