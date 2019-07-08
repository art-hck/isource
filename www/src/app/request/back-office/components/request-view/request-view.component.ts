import {Component, OnInit} from '@angular/core';
import {Uuid} from "../../../../cart/models/uuid";
import {ActivatedRoute} from "@angular/router";
import {RequestService} from "../../services/request.service";
import {Request} from "../../../common/models/request";
import {RequestPosition} from "../../../common/models/request-position";
import {RequestPositionWorkflowStepLabels} from "../../../common/dictionaries/request-position-workflow-step-labels";
import {OffersService} from "../../services/offers.service";
import {RequestPositionWorkflowSteps} from "../../../common/enum/request-position-workflow-steps";
import {RequestTypesLabels} from "../../../common/dictionaries/request-types-labels";
import {RequestTypes} from "../../../common/enum/request-types";
import {DocumentsService} from "../../../common/services/documents.service";

@Component({
  selector: 'app-request-view',
  templateUrl: './request-view.component.html',
  styleUrls: ['./request-view.component.css']
})
export class RequestViewComponent implements OnInit {

  requestId: Uuid;
  request: Request;
  requestPositions: RequestPosition[];
  requestPositionWorkflowStepLabels = Object.entries(RequestPositionWorkflowStepLabels);

  expanded = false;

  constructor(
    private route: ActivatedRoute,
    private requestService: RequestService,
    private offersService: OffersService,
    private documentsService: DocumentsService
  ) {
  }

  ngOnInit() {
    this.requestId = this.route.snapshot.paramMap.get('id');
    this.requestService.getRequestInfo(this.requestId).subscribe(
      (request: Request) => {
        this.request = request;
      }
    );
    this.requestService.getRequestPositions(this.requestId).subscribe(
      (requestPositions: RequestPosition[]) => {
        this.requestPositions = requestPositions;
      }
    );
  }

  onExpanded(): void {
    this.expanded = !this.expanded;
  }

  onChangeStatus(requestPosition: RequestPosition, newStatus: string) {
    this.requestService.changeStatus(this.requestId, requestPosition.id, newStatus).subscribe(
      (data: any) => {
        requestPosition.status = data.status;
        requestPosition.statusLabel = data.statusLabel;
        if (data.requestStatus !== null) {
          this.requestService.getRequestInfo(this.requestId).subscribe(
            (request: Request) => {
              this.request = request;
            }
          );
        }
      });
  }

  onPublishOffers(requestPosition: RequestPosition) {
    this.offersService.publishOffers(this.requestId, requestPosition.id).subscribe(
      (data: any) => {
        requestPosition.status = data.status;
        requestPosition.statusLabel = data.statusLabel;
      }
    );
  }

  canPublish(requestPosition: RequestPosition) {
    return (requestPosition.status === RequestPositionWorkflowSteps.PROPOSALS_PREPARATION
        || requestPosition.status === RequestPositionWorkflowSteps.NEW) && (requestPosition.linkedOffers.length !== 0);
  }

  checkIfFreeForm() {
    return this.request.type === RequestTypes.FREE_FORM;
  }

}
