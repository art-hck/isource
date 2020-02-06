import { Component, Input } from '@angular/core';
import { UserInfoRequestItem } from "../../../models/user-info";
import { Router } from "@angular/router";

@Component({
  selector: 'app-user-card-request-list',
  templateUrl: './user-card-request-list.component.html',
  styleUrls: ['./user-card-request-list.component.scss']
})
export class UserCardRequestListComponent {

  @Input() requests: UserInfoRequestItem[];

  constructor(
    protected router: Router,
  ) { }

  calcPieChart(request: any): number {
    const completedItems =  request.completedCount / request.positionCount * 100;
    return (65 - (65 * completedItems) / 100);
  }

  onRowClick(request: UserInfoRequestItem): void {
    this.router.navigateByUrl(`/requests/backoffice/${request.request.id}`);
  }

}
