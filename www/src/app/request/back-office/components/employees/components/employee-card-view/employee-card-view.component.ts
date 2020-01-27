import { Component, OnInit } from '@angular/core';
import { Uuid } from "../../../../../../cart/models/uuid";
import { ActivatedRoute } from "@angular/router";
import { Observable } from "rxjs";
import { EmployeeListItem } from "../../models/employee-list-item";
import { EmployeesService } from "../../services/employees.service";
import { Title } from "@angular/platform-browser";
import { tap } from "rxjs/operators";
import { UxgBreadcrumbsService } from "uxg";

@Component({
  selector: 'app-employee-card-view',
  templateUrl: './employee-card-view.component.html',
  styleUrls: ['./employee-card-view.component.scss']
})
export class EmployeeCardViewComponent implements OnInit {

  employeeId: Uuid;
  contragent$: Observable<EmployeeListItem>;

  constructor(
    private bc: UxgBreadcrumbsService,
    private title: Title,
    private route: ActivatedRoute,
    protected staffService: EmployeesService
  ) { }

  ngOnInit() {
    this.employeeId = this.route.snapshot.paramMap.get('id');

    console.log(this.employeeId);

    // this.getEmployeeInfo(this.employeeId);
  }

  getEmployeeInfo(employeeId: Uuid): void {
    this.contragent$ = this.staffService.getEmployeeInfo(employeeId).pipe(
      tap(employee => {
        this.title.setTitle(employee.name);
        this.bc.breadcrumbs = [
          {label: "Сотрудники", link: "/staff/list"},
          {label: this.title.getTitle(), link: `/staff/${employee.id}/info`}
        ];
      })
    );
  }

}
