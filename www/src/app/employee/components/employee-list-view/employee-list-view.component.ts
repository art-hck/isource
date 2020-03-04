import { Component, OnInit } from '@angular/core';
import { EmployeeService } from "../../services/employee.service";
import { EmployeeItem } from "../../models/employee-item";

@Component({
  selector: 'app-employee-list-view',
  templateUrl: './employee-list-view.component.html',
  styleUrls: ['./employee-list-view.component.css']
})
export class EmployeeListViewComponent implements OnInit {

  backoffice: EmployeeItem[] = [];
  seniorBackoffice: EmployeeItem[] = [];

  backofficeCount: number;
  seniorBackofficeCount: number;

  constructor(
    protected employeeService: EmployeeService
  ) { }

  ngOnInit() {
    this.getEmployeeList('BACKOFFICE');
    this.getEmployeeList('SENIOR_BACKOFFICE');
  }

  getEmployeeList(type) {
    const subscription = this.employeeService.getEmployeeList(type).subscribe((employee) => {
      (type === 'BACKOFFICE') ?
        this.backoffice = employee :
        this.seniorBackoffice = employee;

      this.backofficeCount = this.backoffice.length;
      this.seniorBackofficeCount = this.seniorBackoffice.length;

      subscription.unsubscribe();
    });
  }

}
