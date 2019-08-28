import { Component, OnInit, Output } from '@angular/core';
import { GetRequestsService } from "../../../common/services/get-requests.service";
import { RequestsList } from "../../../common/models/requests-list/requests-list";
import { Page } from "../../../../core/models/page";
import { ClrDatagridStateInterface } from "@clr/angular";

@Component({
  selector: 'app-request-list-view',
  templateUrl: './request-list-view.component.html',
  styleUrls: ['./request-list-view.component.css']
})
export class RequestListViewComponent implements OnInit {

  public requests: RequestsList[];
  @Output() totalItems: number;
  @Output() datagridLoader: boolean;

  constructor(
    protected getRequestService: GetRequestsService
  ) { }

  ngOnInit() {
  }

  onDatagridStateChange(state): void {
    this.getRequestListForCustomer(state.startFrom, state.pageSize, state.filters);
  }

  getRequestListForCustomer(startFrom, pageSize, filters): void {
    this.getRequestService.getRequests('customer', startFrom, pageSize, filters).subscribe(
      (data: Page<RequestsList>) => {
        this.requests = data.entities;
        this.totalItems = data.totalCount;
      });
  }
}
