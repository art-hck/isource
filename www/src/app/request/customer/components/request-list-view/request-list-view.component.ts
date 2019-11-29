import { Component, OnInit, Output, ViewChild } from '@angular/core';
import { GetRequestsService } from "../../../common/services/get-requests.service";
import { RequestsList } from "../../../common/models/requests-list/requests-list";
import { Page } from "../../../../core/models/page";
import { DatagridStateAndFilter } from "../../../common/models/datagrid-state-and-filter";
import { RequestsListFilter } from "../../../common/models/requests-list/requests-list-filter";
import { RequestWorkflowSteps } from "../../../common/enum/request-workflow-steps";
import { RequestListFilterComponent } from "../../../common/components/request-list/request-list-filter/request-list-filter.component";
import { RequestStatusCount } from "../../../common/models/requests-list/request-status-count";

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
    this.getRequestStatusCount('customer');
  }

  getRequestStatusCount(role: string) {
    this.getRequestService.requestStatusCount(role).subscribe(
      (requestStatusCount: RequestStatusCount) => {
        this.requestStatusCount = requestStatusCount;
      }
    );
  }

  getRequestList(requestStatus: RequestWorkflowSteps) {
    this.requestStatus = requestStatus;
    this.filters = {'requestListStatusesFilter': [this.requestStatus]};
    this.getRequestListForCustomer(0, 10, this.filters);
    this.requestListFilterComponent.clearFilter();
  }

  filter(filter: RequestsListFilter): void {
    this.currentFilters = {...this.filters, ...filter};

    let pageSize = null;

    if (this.currentDatagridState) {
      pageSize = this.currentDatagridState.pageSize;
    }

    if (this.currentDatagridState) {
      pageSize = this.currentDatagridState.pageSize;
    }

    this.getRequestListForCustomer(0, pageSize, this.currentFilters);
  }

  onDatagridStateChange(state: DatagridStateAndFilter): void {
    this.currentDatagridState = state;

    if (this.currentFilters) {
      state.filters = this.currentFilters;
    }

    this.getRequestListForCustomer(state.startFrom, state.pageSize, this.filters);
  }

  getRequestListForCustomer(startFrom, pageSize, filters): void {
    this.getRequestService.getRequests('customer', startFrom, pageSize, filters).subscribe(
      (data: Page<RequestsList>) => {
        this.requests = data.entities;
        this.totalItems = data.totalCount;
      });
  }

  getFilterCounter() {
    if (this.currentFilters) {
      const activeFilters = Object.keys(this.currentFilters).filter(
        filterItem => filterItem !== 'requestListStatusesFilter'
      );
      return activeFilters.length;
    }
    return 0;
  }

  onShowResults() {
    this.filterModalOpened = false;
  }
}
