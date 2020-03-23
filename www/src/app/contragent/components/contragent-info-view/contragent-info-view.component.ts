import {Component, OnDestroy, OnInit} from '@angular/core';
import {Uuid} from "../../../cart/models/uuid";
import {ActivatedRoute} from "@angular/router";
import {Observable, Subscription} from "rxjs";
import {ContragentInfo} from "../../models/contragent-info";
import {ContragentService} from "../../services/contragent.service";
import {Title} from "@angular/platform-browser";
import {map, shareReplay, tap} from "rxjs/operators";
import {UxgBreadcrumbsService} from "uxg";
import {EmployeeService} from "../../../employee/services/employee.service";
import {EmployeeInfoBrief} from "../../../employee/models/employee-info";
import {UserInfoService} from "../../../user/service/user-info.service";

@Component({
  selector: 'app-contragent-info-view',
  templateUrl: './contragent-info-view.component.html',
  styleUrls: ['./contragent-info-view.component.scss']
})
export class ContragentInfoViewComponent implements OnInit, OnDestroy {

  contragentId: Uuid;
  contragent$: Observable<ContragentInfo>;
  employeesList$: Observable<EmployeeInfoBrief[]>;
  subscription = new Subscription();
  editedEmployee: EmployeeInfoBrief;

  constructor(
    private bc: UxgBreadcrumbsService,
    private title: Title,
    private route: ActivatedRoute,
    protected getContragentService: ContragentService,
    protected employeeService: EmployeeService,
    public user: UserInfoService,
  ) {
  }

  ngOnInit() {
    this.contragentId = this.route.snapshot.paramMap.get('id');
    this.getContragentInfo(this.contragentId);
    this.getContragentEmployeesList(this.contragentId);
  }

  getContragentInfo(contragentId: Uuid): void {
    this.contragent$ = this.getContragentService.getContragentInfo(contragentId).pipe(
      tap(contragent => {
        this.title.setTitle(contragent.fullName);
        this.bc.breadcrumbs = [
          {label: "Контрагенты", link: "/contragents/list"},
          {label: this.title.getTitle(), link: `/contragents/${contragent.id}/info`}
        ];
      })
    );
  }

  getContragentEmployeesList(contragentId: Uuid): void {
    this.employeesList$ = this.employeeService.getEmployeesList(contragentId).pipe(shareReplay(1));
  }

  onDownloadPrimaInformReport(): void {
    this.getContragentService.downloadPrimaInformReport(this.contragentId);
  }

  getLoaderState() {
    return this.getContragentService.loading;
  }

  addEmployee(employee: EmployeeInfoBrief) {
    this.subscription.add(this.employeeService.createEmployee(this.contragentId, employee).subscribe(
      (data) => {
        this.employeesList$ = this.employeesList$.pipe(
          map(employeeList => [data, ...employeeList])
        );
      }));
  }

  onClickEditEmployee(employee: EmployeeInfoBrief) {
    this.subscription.add(this.employeeService.editEmployee(employee).subscribe(
      (data) => {
        this.employeesList$ = this.employeesList$.pipe(
          map(employeeList => {
            const index = employeeList.findIndex(_employee => _employee.id === data.id);
            employeeList[index] = data;
            return employeeList;
          })
        )
      }));
  }

  onEditEmployee(employee: EmployeeInfoBrief) {
    this.editedEmployee = employee;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
