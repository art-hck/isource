import { Component, EventEmitter, Input, Output } from '@angular/core';
import { EmployeeItem } from "../../models/employee-item";
import { UserInfoService } from "../../../user/service/user-info.service";
import { Router } from "@angular/router";
import { EmployeeService } from "../../services/employee.service";
import { ToastActions } from "../../../shared/actions/toast.actions";
import { Store } from "@ngxs/store";

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})

export class EmployeeListComponent {

  editedEmployee: EmployeeItem;
  sendingActivationLink = false;

  constructor(
    public userInfoService: UserInfoService,
    protected employeeService: EmployeeService,
    public router: Router,
    private store: Store
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

  resendActivationLink(ev, userId): void {
    ev.preventDefault();
    ev.stopPropagation();

    this.sendingActivationLink = true;

    const subscription = this.employeeService.resendEmployeeActivationLink(userId).subscribe(
      () => {
        this.store.dispatch(new ToastActions.Success("Ссылка на активацию повторно отправлена пользователю"));
        this.sendingActivationLink = false;
        subscription.unsubscribe();
      },
      () => {
        this.store.dispatch(new ToastActions.Error("Не удалось повторно отправить ссылку на активацию"));
        this.sendingActivationLink = false;
        subscription.unsubscribe();
      }
    );
  }
}
