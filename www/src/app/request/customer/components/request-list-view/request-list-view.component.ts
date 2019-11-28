import { Component, OnInit, Output } from '@angular/core';
import { GetRequestsService } from "../../../common/services/get-requests.service";
import { RequestsList } from "../../../common/models/requests-list/requests-list";
import { Page } from "../../../../core/models/page";
import { ClrDatagridStateInterface } from "@clr/angular";
import { DatagridStateAndFilter } from "../../../common/models/datagrid-state-and-filter";
import { RequestsListFilter } from "../../../common/models/requests-list/requests-list-filter";

@Component({
  selector: 'app-request-list-view',
  templateUrl: './request-list-view.component.html',
  styleUrls: ['./request-list-view.component.css']
})
export class RequestListViewComponent implements OnInit {

  currentDatagridState: DatagridStateAndFilter;
  currentFilters: RequestsListFilter;

  filterModalOpened = false;

  public requests: RequestsList[];
  @Output() totalItems: number;
  @Output() datagridLoader: boolean;

  constructor(
    protected getRequestService: GetRequestsService
  ) { }

  ngOnInit() {
  }

  filter(filter: RequestsListFilter): void {
    this.currentFilters = filter;

    let pageSize = null;

    if (this.currentDatagridState) {
      pageSize = this.currentDatagridState.pageSize;
    }

    this.getRequestListForCustomer(0, pageSize, filter, null);
  }

  onDatagridStateChange(state: DatagridStateAndFilter): void {
    this.currentDatagridState = state;

    if (this.currentFilters) {
      state.filters = this.currentFilters;
    }

    this.getRequestListForCustomer(state.startFrom, state.pageSize, state.filters, state.sort);
  }

  getRequestListForCustomer(startFrom, pageSize, filters, sort): void {
    this.getRequestService.getRequests('customer', startFrom, pageSize, filters, sort).subscribe(
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
