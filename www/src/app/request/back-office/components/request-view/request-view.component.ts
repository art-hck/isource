import {Component, OnInit} from '@angular/core';
import {Uuid} from "../../../../cart/models/uuid";
import {ActivatedRoute} from "@angular/router";
import {RequestService} from "../../services/request.service";
import {Request} from "../../../common/models/request";
import {RequestPosition} from "../../../common/models/request-position";
import {RequestPositionWorkflowStepLabels} from "../../../common/dictionaries/request-position-workflow-step-labels";

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

  onChangeStatus(requestPosition: RequestPosition, newStatus: string) {
    this.requestService.changeStatus(this.requestId, requestPosition.id, newStatus).subscribe(
      (data: any) => {
        if (data.requestStatus !== null) {
          this.requestService.getRequestInfo(this.requestId).subscribe(
            (request: Request) => {
              this.request = request;
            }
          )
        }
      });
  }
}
