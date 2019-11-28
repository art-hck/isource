import { Component, OnInit, Output } from '@angular/core';
import { GetRequestsService } from "../../../common/services/get-requests.service";
import { RequestsList } from "../../../common/models/requests-list/requests-list";
import { Page } from "../../../../core/models/page";
import { ClrDatagridStateInterface } from "@clr/angular";
import { DatagridStateAndFilter } from "../../../common/models/datagrid-state-and-filter";
import { RequestWorkflowSteps } from "../../../common/enum/request-workflow-steps";

@Component({
  selector: 'app-request-list-view',
  templateUrl: './request-list-view.component.html',
  styleUrls: ['./request-list-view.component.css']
})
export class RequestListViewComponent implements OnInit {

  public requests: RequestsList[];
  @Output() totalItems: number;
  @Output() datagridLoader: boolean;
  @Output() requestStatus = RequestWorkflowSteps.IN_PROGRESS;

  filters: any;
  requestWorkflowSteps = RequestWorkflowSteps;

  constructor(
    protected getRequestService: GetRequestsService
  ) { }

  ngOnInit() {
    this.filters = {'requestListStatusesFilter': [RequestWorkflowSteps.IN_PROGRESS]};
  }

  getRequestList(requestStatus: RequestWorkflowSteps) {
    this.requestStatus = requestStatus;
    this.filters = {'requestListStatusesFilter': [this.requestStatus]};
    this.getRequestListForCustomer(0, 10, this.filters);
  }

  onDatagridStateChange(state: DatagridStateAndFilter): void {
    this.getRequestListForCustomer(state.startFrom, state.pageSize, this.filters);
  }

  getRequestListForCustomer(startFrom, pageSize, filters): void {
    this.getRequestService.getRequests('customer', startFrom, pageSize, filters).subscribe(
      (data: Page<RequestsList>) => {
        this.requests = data.entities;
        this.totalItems = data.totalCount;
      });
  }
}
