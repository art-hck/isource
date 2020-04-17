import { Component, OnDestroy, OnInit } from '@angular/core';
import { EmployeeService } from "../../services/employee.service";
import { EmployeeItem } from "../../models/employee-item";
import {UserInfoService} from "../../../user/service/user-info.service";
import {Router} from "@angular/router";
import { ToastActions } from "../../../shared/actions/toast.actions";
import { Subscription } from "rxjs";
import { Store } from "@ngxs/store";
import { EmployeeInfoBrief } from "../../models/employee-info";

@Component({
  selector: 'app-employee-list-view',
  templateUrl: './employee-list-view.component.html'
})
export class EmployeeListViewComponent implements OnInit, OnDestroy {

  subscription = new Subscription();

  backoffice: EmployeeItem[] = [];
  seniorBackoffice: EmployeeItem[] = [];

  backofficeCount: number;
  seniorBackofficeCount: number;

  editedEmployee: EmployeeItem;

  constructor(
    protected employeeService: EmployeeService,
    public userInfoService: UserInfoService,
    public router: Router,
    private store: Store
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

  addEmployee(employee: EmployeeInfoBrief) {
    this.subscription.add(this.employeeService.registerEmployee(employee).subscribe(
      (data: any) => {
        const preparedData = { user: data, posCount: 0, reqCount: 0 };

        if (employee.role === 'BACKOFFICE_BUYER') {
          this.backoffice.push(preparedData);
          ++this.backofficeCount;
        } else if (employee.role === 'SENIOR_BACKOFFICE') {
          this.seniorBackoffice.push(preparedData);
          ++this.seniorBackofficeCount;
        }

        this.store.dispatch(new ToastActions.Success("Сотрудник успешно создан!"));
      },
      (err) => {
        this.store.dispatch(new ToastActions.Error('Ошибка создания! ' + err.error.detail));
      }));
  }

  updateEmployeeListItem(employee: EmployeeInfoBrief) {
    this.editedEmployee = null;

    this.subscription.add(this.employeeService.editEmployee(employee).subscribe(
      (data) => {
        const backofficeListIndex = this.backoffice.findIndex(employeeItem => employeeItem.user.id === data.id);
        const seniorBackofficeListIndex = this.seniorBackoffice.findIndex(employeeItem => employeeItem.user.id === data.id);

        if (backofficeListIndex !== -1) {
          this.backoffice[backofficeListIndex].user = data;
        } else if (seniorBackofficeListIndex !== -1) {
          this.seniorBackoffice[seniorBackofficeListIndex].user = data;
        }

        this.store.dispatch(new ToastActions.Success("Сотрудник успешно отредактирован!"));
      },
      (err) => {
        this.store.dispatch(new ToastActions.Error('Ошибка редактирования! ' + err.error.detail));
      }));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
