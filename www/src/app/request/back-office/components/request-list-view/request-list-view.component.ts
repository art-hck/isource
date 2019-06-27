import { Component, OnInit } from '@angular/core';
import {RequestsList} from "../../../common/models/requests-list/requests-list";
import {GetRequestsService} from "../../../common/services/get-requests.service";

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
    this.getRequestListForBackoffice();
  }

  getRequestListForBackoffice() {
    this.getRequestService.getRequestsList('backoffice').subscribe(
      (data: RequestsList[]) => {
        this.requests = data;
      });
  }

}
