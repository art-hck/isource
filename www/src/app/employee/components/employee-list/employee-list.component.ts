import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from "@angular/router";
import { EmployeeItem } from "../../models/employee-item";
import { DatagridStateAndFilter } from "../../../request/common/models/datagrid-state-and-filter";
import { Uuid } from "../../../cart/models/uuid";

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent {

  @Output() datagridState = new EventEmitter<DatagridStateAndFilter>();

  @Input() searchValue: string;
  @Input() employees: EmployeeItem[];

  constructor(private router: Router) { }

  onRowClick(employeeId: Uuid): void {
    this.router.navigateByUrl(`/employees/${employeeId}/info`);
  }

  /**
   * Функция предотвращает открытие карточки сотрудника при клике на его эл. почту
   *
   * @param ev
   * @param email
   */
  mailto(ev, email): void {
      ev.preventDefault();
      ev.stopPropagation();

      window.open('mailto:' + email);
  }
}
