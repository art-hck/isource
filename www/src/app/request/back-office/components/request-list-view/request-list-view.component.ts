import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { RequestsList } from "../../../common/models/requests-list/requests-list";
import { GetRequestsService } from "../../../common/services/get-requests.service";
import { Page } from "../../../../core/models/page";
import { DatagridStateAndFilter } from "../../../common/models/datagrid-state-and-filter";
import { RequestWorkflowSteps } from "../../../common/enum/request-workflow-steps";
import { RequestsListFilter } from "../../../common/models/requests-list/requests-list-filter";
import { Request } from "../../../common/models/request";
import { RequestStatusCount } from "../../../common/models/requests-list/request-status-count";
import { RequestListFilterComponent } from "../../../common/components/request-list/request-list-filter/request-list-filter.component";

@Component({
  selector: 'app-request-list-view',
  templateUrl: './request-list-view.component.html',
  styleUrls: ['./request-list-view.component.css']
})
export class RequestListViewComponent implements OnInit {

  @ViewChild(RequestListFilterComponent, {static: false})
             requestListFilterComponent: RequestListFilterComponent;

  currentDatagridState: DatagridStateAndFilter;
  currentFilters: RequestsListFilter;

  filterModalOpened = false;

  pageSize = 10;

  public requests: RequestsList[];
  @Output() totalItems: number;
  @Output() datagridLoader: boolean;
  @Output() requestStatus = RequestWorkflowSteps.IN_PROGRESS;

  filters: any;
  requestWorkflowSteps = RequestWorkflowSteps;
  requestStatusCount: RequestStatusCount;

  constructor(
    protected getRequestService: GetRequestsService
  ) { }

  ngOnInit() {
    this.filters = {'requestListStatusesFilter': [RequestWorkflowSteps.IN_PROGRESS]};
    this.getRequestStatusCount('backoffice');
  }

  getRequestList(requestStatus: RequestWorkflowSteps) {
    this.requestStatus = requestStatus;
    this.filters = {'requestListStatusesFilter': [this.requestStatus]};
    this.getRequestListForBackoffice(0, 10, this.filters);
    this.requestListFilterComponent.clearFilter();
    this.getRequestListForBackoffice(0, this.pageSize, this.filters);
  }

  getRequestStatusCount(role: string) {
      this.getRequestService.requestStatusCount(role).subscribe(
        (requestStatusCount: RequestStatusCount) => {
          this.requestStatusCount = requestStatusCount;
        }
      );
  }

  filter(filter: RequestsListFilter): void {
    this.currentFilters = filter;

    let pageSize = null;

    if (this.currentDatagridState) {
      pageSize = this.currentDatagridState.pageSize;
    }

    this.getRequestListForBackoffice(0, pageSize, filter);
  }

  onDatagridStateChange(state: DatagridStateAndFilter): void {
    this.currentDatagridState = state;

    if (this.currentFilters) {
      state.filters = this.currentFilters;
    }

    this.getRequestListForBackoffice(state.startFrom, state.pageSize, this.filters);
  }

  getRequestListForBackoffice(startFrom, pageSize, filters): void {
    this.getRequestService.getRequests('backoffice', startFrom, pageSize, filters).subscribe(
      (data: Page<RequestsList>) => {
        this.requests = data.entities;
        this.totalItems = data.totalCount;
      });
  }

  getFilterCounter() {
    if (this.currentFilters) {
      return Object.keys(this.currentFilters).length;
    }
    return 0;
  }

  onShowResults() {
    this.filterModalOpened = false;
  }
}
