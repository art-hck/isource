import { Component, EventEmitter, Input, Output } from '@angular/core';
import { EmployeeItem } from "../../models/employee-item";
import { UserInfoService } from "../../../user/service/user-info.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})

export class EmployeeListComponent {

  editedEmployee: EmployeeItem;

  constructor(
    public userInfoService: UserInfoService,
    public router: Router
  ) { }

  @Input() employees: EmployeeItem[];
  @Output() edit = new EventEmitter();

  openEditModal(ev, employee) {
    ev.preventDefault();
    ev.stopPropagation();

    this.edit.emit(employee);
  }

  mailto(ev, email): void {
    ev.preventDefault();
    ev.stopPropagation();

    window.open('mailto:' + email);
  }
}
