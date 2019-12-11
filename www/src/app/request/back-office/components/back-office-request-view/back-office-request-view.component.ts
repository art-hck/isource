import { Component, OnInit, ViewChild } from '@angular/core';
import { Request } from "../../../common/models/request";
import { RequestPosition } from "../../../common/models/request-position";
import { ActivatedRoute } from "@angular/router";
import { RequestService } from "../../services/request.service";
import { Uuid } from "../../../../cart/models/uuid";
import { RequestViewComponent } from 'src/app/request/common/components/request-view/request-view.component';
import { RequestWorkflowSteps } from "../../../common/enum/request-workflow-steps";
import { RequestPositionWorkflowSteps } from "../../../common/enum/request-position-workflow-steps";
import {RequestGroup} from "../../../common/models/request-group";
import { Title } from "@angular/platform-browser";
import { UxgBreadcrumbsService } from "../../../../ux-guidlines/components/uxg-breadcrumbs/uxg-breadcrumbs.service";

@Component({
  selector: 'app-back-office-request-view',
  templateUrl: './back-office-request-view.component.html',
  styleUrls: ['./back-office-request-view.component.css']
})
export class BackOfficeRequestViewComponent implements OnInit {

  @ViewChild(RequestViewComponent, {static: false}) requestView: RequestViewComponent;

  request: Request;
  requestPositions: (RequestPosition | RequestGroup)[] = [];

  protected requestId: Uuid;

  constructor(
    public title: Title,
    private bc: UxgBreadcrumbsService,
    private route: ActivatedRoute,
    private requestService: RequestService,
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

    if (this.hasDrafts) {
      return true;
    }

    return false;
  }

  get hasDrafts(): boolean {
    return this.requestPositions.filter(function getDraftRecursive(position) {
      const isDraft: boolean = position instanceof RequestPosition &&  position.status === RequestPositionWorkflowSteps.DRAFT;
      const isGroupHasDrafts: boolean = position instanceof RequestGroup && position.positions.filter(getDraftRecursive).length > 0;

      return isDraft || isGroupHasDrafts;
    }).length > 0;
  }

  onPublish(): void {
    this.requestService.publishRequest(this.requestId).subscribe(
      (data: any) => {
        this.requestView.selectPositionListItem = null;
        this.updateRequestInfo();
        this.updatePositionsList();
      }
    );
  }

  protected updateRequestInfo() {
    this.requestService.getRequestInfo(this.requestId).subscribe(
      (request: Request) => {
        this.request = request;
        this.title.setTitle(request.name || "Заявка №" + request.id);

        this.bc.breadcrumbs = [
          { label: "Заявки", link: "/requests/backoffice" },
          { label: this.title.getTitle(), link: "/requests/backoffice/" + request.id }
        ];
      }
    );
  }
}
