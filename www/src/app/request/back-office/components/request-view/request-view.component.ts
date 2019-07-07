import {Component, OnInit} from '@angular/core';
import {Uuid} from "../../../../cart/models/uuid";
import {ActivatedRoute} from "@angular/router";
import {RequestService} from "../../services/request.service";
import {Request} from "../../../common/models/request";
import {RequestPosition} from "../../../common/models/request-position";
import {RequestPositionWorkflowStepLabels} from "../../../common/dictionaries/request-position-workflow-step-labels";
import {RequestTypes} from "../../../common/enum/request-types";

@Component({
  selector: 'app-request-view',
  templateUrl: './request-view.component.html',
  styleUrls: ['./request-view.component.css']
})
export class RequestViewComponent implements OnInit {

  requestId: Uuid;
  request: Request;
  requestPositions: RequestPosition[];
  selectedRequestPosition: RequestPosition;

  showInfo = false;
  showRequestInfo: boolean;
  showPositionList = true;
  selectedIndex: number;
  requestPositionWorkflowStepLabels = Object.entries(RequestPositionWorkflowStepLabels);

  expanded = false;

  constructor(
    private route: ActivatedRoute,
    private requestService: RequestService
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

  checkIfFreeForm() {
    return this.request.type === RequestTypes.FREE_FORM;
  }

  onSelectPosition(requestPosition: RequestPosition, i: number) {
    this.selectedRequestPosition = requestPosition;
    this.showInfo = true;
    this.showRequestInfo = false
    this.selectedIndex = i;
  }

  onSelectRequest() {
    this.showRequestInfo = true;
    this.showInfo = false
  }
}
