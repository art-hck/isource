import {Component, OnInit} from '@angular/core';
import {Uuid} from "../../../../cart/models/uuid";
import {ActivatedRoute} from "@angular/router";
import {RequestService} from "../../services/request.service";
import {Request} from "../../../common/models/request";
import {RequestPosition} from "../../../common/models/request-position";
import {RequestPositionWorkflowSteps} from "../../../common/enum/request-position-workflow-steps";
import {RequestTypes} from "../../../common/enum/request-types";
import {RequestTypesLabels} from "../../../common/dictionaries/request-types-labels";

@Component({
  selector: 'app-request-view',
  templateUrl: './request-view.component.html',
  styleUrls: ['./request-view.component.css']
})
export class RequestViewComponent implements OnInit {

  requestId: Uuid;
  request: Request;
  requestPositions: RequestPosition[];

  offerWinner: Uuid;

  expanded = false;

  constructor(private route: ActivatedRoute, private requestService: RequestService) {
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

  getOfferWinner(offerWinner: Uuid) {
    this.offerWinner = offerWinner;
  }

  onChoiceWinner(requestPosition: RequestPosition) {
    this.requestService.choiceWinner(this.offerWinner, requestPosition.id, this.requestId).subscribe(
      (data: any) => {
        requestPosition.status = data.status;
        requestPosition.statusLabel = data.statusLabel;
      }
    );
  }

  canChoice(requestPosition: RequestPosition) {
    return (requestPosition.linkedOffers || requestPosition.linkedOffers !== null)
      && (requestPosition.status === RequestPositionWorkflowSteps.RESULTS_AGREEMENT);
  }

  getFreeFormLabel() {
    return RequestTypesLabels['FREE_FORM'];
  }
}
