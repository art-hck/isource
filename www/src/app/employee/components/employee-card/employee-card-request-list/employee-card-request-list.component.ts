import { Component, Input } from '@angular/core';
import { EmployeeInfoRequestItem } from "../../../models/employee-info";
import { Router } from "@angular/router";

@Component({
  selector: 'app-employee-card-request-list',
  templateUrl: './employee-card-request-list.component.html',
  styleUrls: ['./employee-card-request-list.component.scss']
})
export class EmployeeCardRequestListComponent {

  @Input() requests: EmployeeInfoRequestItem[];

  constructor(
    protected router: Router,
  ) { }

  calcPieChart(request: any): number {
    const completedItems =  request.completedCount / request.positionCount * 100;
    return (65 - (65 * completedItems) / 100);
  }

  onRowClick(request: EmployeeInfoRequestItem): void {
    this.router.navigateByUrl(`/requests/backoffice/${request.request.id}`);
  }

}
