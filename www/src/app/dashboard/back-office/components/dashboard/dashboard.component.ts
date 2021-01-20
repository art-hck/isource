import { Component, OnInit, OnDestroy, ViewChildren, QueryList, ViewChild } from '@angular/core';
import { DashboardView } from "../../models/dashboard-view";
import { Select, Store } from "@ngxs/store";
import FetchTasks = DashboardActions.FetchTasks;
import FetchAgreements = DashboardActions.FetchAgreements;
import { Agreement } from "../../../../agreements/common/models/Agreement";
import { StateStatus } from "../../../../request/common/models/state-status";
import { DashboardState } from "../../states/dashboard.state";
import { DashboardTaskItem } from "../../models/dashboard-task-item";
import { Observable, Subject } from "rxjs";
import { DashboardActions } from "../../actions/dashboard.actions";
import { StatusesStatisticsInfo } from "../../../common/models/statuses-statistics";
import {
  DashboardAvailableFiltersCustomerItem,
  DashboardAvailableFiltersRequestItem,
  DashboardAvailableFiltersResponsibleUserItem
} from "../../../common/models/dashboard-available-filters";
import { takeUntil, tap, withLatestFrom } from "rxjs/operators";
import FetchStatusesStatistics = DashboardActions.FetchStatusesStatistics;
import FetchAvailableFilters = DashboardActions.FetchAvailableFilters;
import { ActivatedRoute } from "@angular/router";
import { FormControl, FormGroup } from "@angular/forms";
import { DashboardStatisticsComponent } from "../../../common/components/dashboard-statistics/dashboard-statistics.component";
import { UxgPopoverComponent } from "uxg";
import { AgreementActionFilters } from "../../../../agreements/back-office/dictionaries/agreement-action-label";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  @ViewChildren('viewPopover') viewPopover: QueryList<UxgPopoverComponent>;
  @ViewChild('dashboardStatisticsComponent') dashboardStatisticsComponent: DashboardStatisticsComponent;

  @Select(DashboardState.agreements) agreements$: Observable<Agreement[]>;
  @Select(DashboardState.tasks) tasks$: Observable<Agreement[]>;
  @Select(DashboardState.status) status$: Observable<StateStatus>;
  @Select(DashboardState.tasksTotalCount) tasksTotalCount$: Observable<number>;
  @Select(DashboardState.agreementsTotalCount) agreementsTotalCount$: Observable<number>;
  @Select(DashboardState.agreementsBar) agreementsBar$: Observable<DashboardTaskItem[]>;
  @Select(DashboardState.tasksBar) tasksBar$: Observable<DashboardTaskItem[]>;

  @Select(DashboardState.statusesStatistics) statusesStatistics$: Observable<StatusesStatisticsInfo>;
  @Select(DashboardState.filterRequestList) filterRequestList$: Observable<DashboardAvailableFiltersRequestItem[]>;
  @Select(DashboardState.filterCustomerList) filterCustomerList$: Observable<DashboardAvailableFiltersCustomerItem[]>;
  @Select(DashboardState.filterResponsibleUsersList) filterResponsibleUsersList$: Observable<DashboardAvailableFiltersResponsibleUserItem[]>;

  destroy$ = new Subject();
  view: DashboardView = "tasks";

  form = new FormGroup({
    requests: new FormControl(null),
    customers: new FormControl(null),
    users: new FormControl(null),
    shipmentDateFrom: new FormControl(null),
    shipmentDateTo: new FormControl(null),
  });

  constructor(
    private route: ActivatedRoute,
    public store: Store
  ) { }

  ngOnInit() {
    this.switchView(this.view);

    this.route.params.pipe(
      tap(() => this.store.dispatch([new FetchStatusesStatistics({}), new FetchAvailableFilters({})])),
      withLatestFrom(this.statusesStatistics$),
      takeUntil(this.destroy$)
    ).subscribe();
  }

  switchView(view: DashboardView) {
    this.view = view;
    this.viewPopover?.first.hide();
    this.view === 'tasks' ? this.store.dispatch(FetchTasks) : this.store.dispatch(FetchAgreements);
  }

  getQueryParams() {
    return {actions: JSON.stringify(AgreementActionFilters[18].type)};
  }

  submitFilter(filters: { key, value}) {
    this.updateSelectedItemsCount();

    for (const [key, value] of Object.entries(filters)) {
      if (!value?.length) { delete filters[key]; }
    }

    this.store.dispatch(new FetchStatusesStatistics(filters));
    this.store.dispatch(new FetchAvailableFilters(filters)).subscribe(() => {
      this.dashboardStatisticsComponent.updateSelectedItemsCount();
    });
  }

  updateSelectedItemsCount(): void {
    this.dashboardStatisticsComponent.requestsSelectList.submit();
    this.dashboardStatisticsComponent.customersSelectList.submit();
    this.dashboardStatisticsComponent.usersSelectList.submit();

    this.dashboardStatisticsComponent.selectedRequests = this.form.get('requests').value?.map(request => request.id);
    this.dashboardStatisticsComponent.selectedCustomers = this.form.get('customers').value?.map(customer => customer.id);
    this.dashboardStatisticsComponent.selectedUsers = this.form.get('users').value?.map(user => user.id);
  }

  resetFilter(): void {
    this.form.reset({
      requests: null,
      customers: null,
      users: null,
      shipmentDateFrom: null,
      shipmentDateTo: null,
    }, {emitEvent: false});

    this.dashboardStatisticsComponent.selectedCustomers = [];
    this.dashboardStatisticsComponent.selectedRequests = [];
    this.dashboardStatisticsComponent.selectedUsers = [];

    this.store.dispatch(new FetchAvailableFilters({}));
    this.store.dispatch(new FetchStatusesStatistics({}));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
