import { Component, Input } from '@angular/core';
import { EmployeesService } from "../../services/employees.service";
import { EmployeeListItem } from "../../models/employee-list-item";

@Component({
  selector: 'app-employee-card',
  templateUrl: './employee-card.component.html',
  styleUrls: ['./employee-card.component.scss']
})
export class EmployeeCardComponent {

  @Input() employee: EmployeeListItem;

  constructor(
    protected employeesService: EmployeesService
  ) { }

  getLoaderState() {
    return this.employeesService.loading;
  }

}
