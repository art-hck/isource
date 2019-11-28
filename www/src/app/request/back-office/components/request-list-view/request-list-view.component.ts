import { Component, OnInit, Output } from '@angular/core';
import { RequestsList } from "../../../common/models/requests-list/requests-list";
import { GetRequestsService } from "../../../common/services/get-requests.service";
import { Page } from "../../../../core/models/page";
import { DatagridStateAndFilter } from "../../../common/models/datagrid-state-and-filter";

@Component({
  selector: 'app-request-list-view',
  templateUrl: './request-list-view.component.html',
  styleUrls: ['./request-list-view.component.css']
})
export class RequestListViewComponent implements OnInit {

  public requests: RequestsList[];
  @Output() totalItems: number;
  @Output() datagridLoader: boolean;
  @Output() requestStatus = 'IN_PROGRESS';

  filters: any;

  constructor(
    protected getRequestService: GetRequestsService
  ) { }

  ngOnInit() {
    this.filters = {'requestListStatusesFilter': ['IN_PROGRESS']};
  }

  getRequestList(requestStatus: string) {
    this.requestStatus = requestStatus;
    this.filters = {'requestListStatusesFilter': [this.requestStatus]};
    this.getRequestListForBackoffice(0, 10, this.filters);

  }

  onDatagridStateChange(state: DatagridStateAndFilter): void {
    this.getRequestListForBackoffice(state.startFrom, state.pageSize, this.filters);
  }

  getRequestListForBackoffice(startFrom, pageSize, filters): void {
    this.getRequestService.getRequests('backoffice', startFrom, pageSize, filters).subscribe(
      (data: Page<RequestsList>) => {
        this.requests = data.entities;
        this.totalItems = data.totalCount;
      });
  }
}
