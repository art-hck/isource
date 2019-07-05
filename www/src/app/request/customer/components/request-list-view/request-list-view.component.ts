import { Component, OnInit } from '@angular/core';
import { GetRequestsService } from "../../../common/services/get-requests.service";
import { RequestsList } from "../../../common/models/requests-list/requests-list";

@Component({
  selector: 'app-request-list-view',
  templateUrl: './request-list-view.component.html',
  styleUrls: ['./request-list-view.component.css']
})
export class RequestListViewComponent implements OnInit {

  public requests: RequestsList[];

  constructor(
    protected getRequestService: GetRequestsService
  ) { }

  ngOnInit() {
    this.getRequestListForCustomer();
  }

  getRequestListForCustomer() {
    this.getRequestService.getRequestsList('customer').subscribe(
      (data: RequestsList[]) => {
        this.requests = data;
      });
  }

}
