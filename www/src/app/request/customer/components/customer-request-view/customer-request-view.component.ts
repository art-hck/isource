import { Component, OnInit, ViewChild } from '@angular/core';
import { Uuid } from "../../../../cart/models/uuid";
import { Request } from "../../../common/models/request";
import { RequestPosition } from "../../../common/models/request-position";
import { ActivatedRoute } from "@angular/router";
import { RequestService } from "../../services/request.service";
import { RequestViewComponent } from 'src/app/request/common/components/request-view/request-view.component';
import { RequestWorkflowSteps } from "../../../common/enum/request-workflow-steps";
import { RequestPositionWorkflowSteps } from "../../../common/enum/request-position-workflow-steps";
import { RequestPositionList } from "../../../common/models/request-position-list";
import { RequestGroup } from 'src/app/request/common/models/request-group';
import { QualityService } from "../../services/quality.service";

@Component({
  selector: 'app-customer-request-view',
  templateUrl: './customer-request-view.component.html',
  styleUrls: ['./customer-request-view.component.css']
})
export class CustomerRequestViewComponent implements OnInit {
  @ViewChild(RequestViewComponent, {static: false}) requestView: RequestViewComponent;

  request: Request;
  updatedPosition: RequestPosition;
  requestPositions: RequestPositionList[];
  rejectionMessageModalOpen = false;
  rejectionMessage: string;

  protected requestId: Uuid;

  constructor(
    private route: ActivatedRoute,
    private requestService: RequestService,
    public qualityService: QualityService
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
      this.selectUpdatedPosition();
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
      if ((position as RequestPosition).status === RequestPositionWorkflowSteps.DRAFT) {
        return true;
      }
    }

    return false;
  }

  onPublish(): void {
    this.requestService.publishRequest(this.requestId).subscribe(
      (data: any) => {
        this.getRequest();
        this.getRequestPositions();
      }
    );
  }

  canApproveOrReject(): boolean {
    if (!this.request || !this.requestPositions) {
      return false;
    }

    if (this.request.status === RequestWorkflowSteps.ON_CUSTOMER_APPROVAL) {
      return true;
    }

    return this.hasApprovedStatus(this.requestPositions);
  }

  onApprove(): void {
    this.requestService.approveRequest(this.requestId).subscribe(
      (data: any) => {
        this.requestView.selectPositionListItem = null;
        this.getRequest();
        this.getRequestPositions();
      }
    );
  }

  onShowDeclineMessageModal(): void {
    this.rejectionMessageModalOpen = true;
  }

  onDecline(): void {
    this.requestService.rejectRequest(this.requestId, this.rejectionMessage).subscribe(
      (data: any) => {
        this.rejectionMessageModalOpen = false;
        this.requestView.selectPositionListItem = null;
        this.getRequest();
        this.getRequestPositions();
      }
    );
  }

  selectUpdatedPosition(): void {
    if (this.requestView.selectPositionListItem) {
      this.requestView.selectPositionListItem = this.requestPositions.find(
        requestPosition => {
          return requestPosition.id === this.requestView.selectPositionListItem.sourceRequestPositionId;
        }
      );
    }
  }

  checkDeclineButtonEnabled(): boolean {
    if (this.rejectionMessage && this.rejectionMessage.length) {
      return true;
    }
    return false;
  }

  protected hasApprovedStatus(items: RequestPositionList[]): boolean {
    for (const item of items) {
      const position = this.getPosition(item);
      if (position && position.status === RequestPositionWorkflowSteps.ON_CUSTOMER_APPROVAL) {
        return true;
      }
      const group = this.getGroup(item);
      if (group && this.hasApprovedStatus(group.positions)) {
        return true;
      }
    }
    return false;
  }

  protected getPosition(item: RequestPositionList): RequestPosition|null {
    if (item.entityType === 'POSITION') {
      return item as RequestPosition;
    }
    return null;
  }

  protected getGroup(item: RequestPositionList): RequestGroup|null {
    if (item.entityType === 'GROUP') {
      return item as RequestGroup;
    }
    return null;
  }

  onUpdateRequestInfo() {
    this.getRequest();
  }
}
