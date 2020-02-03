import { Component, Input, OnInit } from '@angular/core';
import { UserInfoRequestItem } from "../../../models/user-info";
import { RequestsList } from "../../../../../../common/models/requests-list/requests-list";
import { Router } from "@angular/router";

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
