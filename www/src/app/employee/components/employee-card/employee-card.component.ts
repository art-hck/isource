import { Component, Input, OnInit } from '@angular/core';
import { EmployeeService } from "../../services/employee.service";
import { EmployeeInfo, EmployeeInfoBrief, EmployeeInfoRequestItem } from "../../models/employee-info";
import { UxgBreadcrumbsService } from "uxg";
import { Title } from "@angular/platform-browser";
import { ActivatedRoute } from "@angular/router";
import { Uuid } from "../../../cart/models/uuid";
import { EmployeeListRequestPosition } from "../../models/employee-list-request-position";

@Component({
  selector: 'app-employee-card',
  templateUrl: './employee-card.component.html',
  styleUrls: ['./employee-card.component.scss']
})
export class EmployeeCardComponent implements OnInit {

  @Input() employeeCardInfo: EmployeeInfo;

  employeeId: Uuid;

  employee: EmployeeInfoBrief;

  requestList: EmployeeInfoRequestItem[];
  positionsList: EmployeeListRequestPosition[];

  requestCount: number;
  positionCount: number;

  constructor(
    private bc: UxgBreadcrumbsService,
    private title: Title,
    private route: ActivatedRoute,
    protected employeeService: EmployeeService
  ) { }

  ngOnInit() {
    this.employeeId = this.route.snapshot.paramMap.get('id');
    this.getEmployeeInfo(this.employeeId);
  }

  getEmployeeInfo(id: Uuid): void {
    const subscription = this.employeeService.getEmployeeInfo(id).subscribe(employeeInfo => {
      this.requestList = employeeInfo.requests;
      this.positionsList = employeeInfo.positions;
      this.employee = employeeInfo.user;

      this.bc.breadcrumbs = [
        { label: "Сотрудники", link: "/employees" },
        { label: employeeInfo.user.fullName, link: `/employees/${employeeInfo.user.id}/info` }
      ];

      this.requestCount = this.requestList ? (this.requestList.length || 0) : null;
      this.positionCount = this.positionsList ? this.positionsList.length : 0;

      subscription.unsubscribe();
    });
  }

}
