import {Component, OnInit, ViewChild} from '@angular/core';
import {Request} from "../../../common/models/request";
import {RequestPosition} from "../../../common/models/request-position";
import {ActivatedRoute} from "@angular/router";
import {RequestService} from "../../services/request.service";
import {Uuid} from "../../../../cart/models/uuid";
import { RequestViewComponent } from 'src/app/request/common/components/request-view/request-view.component';
import { RequestWorkflowSteps } from "../../../common/enum/request-workflow-steps";
import { RequestPositionWorkflowSteps } from "../../../common/enum/request-position-workflow-steps";

@Component({
  selector: 'app-back-office-request-view',
  templateUrl: './back-office-request-view.component.html',
  styleUrls: ['./back-office-request-view.component.css']
})
export class BackOfficeRequestViewComponent implements OnInit {
  requestId: Uuid;
  request: Request;
  requestPositions: RequestPosition[] = [];

  @ViewChild(RequestViewComponent, {static: false})
  requestView: RequestViewComponent;

  constructor(
    private route: ActivatedRoute,
    private requestService: RequestService
  ) {
  }

  ngOnInit() {
    this.requestId = this.route.snapshot.paramMap.get('id');
    this.updateRequestInfo();
    this.updatePositionsList();
  }

  updatePositionsList(callback?: (positions: RequestPosition[]) => void): void {
    this.requestService.getRequestPositions(this.requestId).subscribe(
      (requestPositions: RequestPosition[]) => {
        this.requestPositions = requestPositions;
        this.requestView.requestPositions = requestPositions;
        if (callback) {
          callback(requestPositions);
        }
      }
    );
  }

  onUpdateRequestInfo() {
    this.updateRequestInfo();
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
        this.updateRequestInfo();
        this.updatePositionsList();
      }
    );
  }

  protected updateRequestInfo() {
    this.requestService.getRequestInfo(this.requestId).subscribe(
      (request: Request) => {
        this.request = request;
      }
    );
  }
}
