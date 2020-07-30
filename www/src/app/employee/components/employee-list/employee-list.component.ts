import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { EmployeeItem } from "../../models/employee-item";
import { UserInfoService } from "../../../user/service/user-info.service";
import { Router } from "@angular/router";
import { EmployeeService } from "../../services/employee.service";
import { ToastActions } from "../../../shared/actions/toast.actions";
import { Store } from "@ngxs/store";
import { Observable, Subject } from "rxjs";
import { EmployeeSettings } from "../../models/employee-settings";
import { Uuid } from "../../../cart/models/uuid";
import { FormBuilder, FormGroup } from "@angular/forms";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})

export class EmployeeListComponent implements OnChanges, OnDestroy {
  @Input() employees: EmployeeItem[];
  @Input() userInfo$: Observable<EmployeeSettings>;
  @Output() edit = new EventEmitter<{ internalAvailable: boolean, externalAvailable: boolean, userId: Uuid }>();
  @Output() getUserInfo = new EventEmitter<Uuid>();

  editedEmployee: EmployeeItem;
  sendingActivationLink = false;
  public form: FormGroup;
  readonly destroy$ = new Subject();

  constructor(
    public userInfoService: UserInfoService,
    protected employeeService: EmployeeService,
    public router: Router,
    private store: Store,
    private fb: FormBuilder
  ) { }

  ngOnChanges() {
      this.userInfo$?.pipe(takeUntil(this.destroy$)).subscribe(
        (data) => {
          this.form = this.fb.group({
            internalAvailable: data.isExternalAvailable,
            externalAvailable: data.isInternalAvailable
          });
        }
      );
  }

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

  editSettings(userId) {
    const settings = {
      internalAvailable: this.form.get("internalAvailable").value,
      externalAvailable: this.form.get("externalAvailable").value,
      userId
    };
    this.edit.emit(settings);
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

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
