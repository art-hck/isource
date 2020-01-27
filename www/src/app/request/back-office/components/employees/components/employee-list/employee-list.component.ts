import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from "@angular/router";
import { DatagridStateAndFilter } from "../../../../../common/models/datagrid-state-and-filter";
import { EmployeeListItem } from "../../models/employee-list-item";
import { Uuid } from "../../../../../../cart/models/uuid";

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent implements OnInit {

  @Output() datagridState = new EventEmitter<DatagridStateAndFilter>();

  @Input() searchValue: string;
  @Input() employees: EmployeeListItem[];

  constructor(
    protected router: Router,
  ) { }

  ngOnInit() {
  }

  onRowClick(employeeId: Uuid): void {
    this.router.navigateByUrl(`/employee/${employeeId}/info`);
  }
}
