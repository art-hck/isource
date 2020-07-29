import { Component, EventEmitter, Input, Output } from '@angular/core';
import { EmployeeItem } from "../../models/employee-item";
import { UserInfoService } from "../../../user/service/user-info.service";
import { Router } from "@angular/router";
import { EmployeeService } from "../../services/employee.service";
import { ToastActions } from "../../../shared/actions/toast.actions";
import { Store } from "@ngxs/store";
import { Observable } from "rxjs";
import { User } from "../../../user/models/user";

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
  @Input() userInfo$: Observable<User>;
  @Output() edit = new EventEmitter();
  @Output() getUserInfo = new EventEmitter();

  openEditModal(ev, userId) {
    ev.preventDefault();
    ev.stopPropagation();
    this.getUserInfo.emit(userId);
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
