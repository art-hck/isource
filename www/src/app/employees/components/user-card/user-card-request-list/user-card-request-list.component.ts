import { Component, Input, OnInit } from '@angular/core';
import { UserInfoRequestItem } from "../../../models/user-info";
import { Router } from "@angular/router";
import { RequestsList } from "../../../../request/common/models/requests-list/requests-list";

@Component({
  selector: 'app-user-card-request-list',
  templateUrl: './user-card-request-list.component.html',
  styleUrls: ['./user-card-request-list.component.scss']
})
export class UserCardRequestListComponent implements OnInit {

  @Input() requests: UserInfoRequestItem[];

  constructor(
    protected router: Router,
  ) { }

  ngOnInit() {
  }

  calcPieChart(request: any): number {
    const completedItems =  request.completedCount / request.positionCount * 100;
    return (65 - (65 * completedItems) / 100);
  }

  onRowClick(request: RequestsList): void {
    this.router.navigateByUrl(`/requests/backoffice/${request.request.id}`);
  }

}
