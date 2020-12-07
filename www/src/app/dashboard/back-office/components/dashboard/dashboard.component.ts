import { Component, OnChanges, OnInit, OnDestroy, SimpleChanges, ViewChildren, QueryList } from '@angular/core';
import { DashboardView } from "../../models/dashboard-view";
import { Select, Store } from "@ngxs/store";
import FetchTasks = DashboardActions.FetchTasks;
import FetchAgreements = DashboardActions.FetchAgreements;
import { Agreement } from "../../../../agreements/common/models/Agreement";
import { StateStatus } from "../../../../request/common/models/state-status";
import { DashboardState } from "../../states/dashboard.state";
import { DashboardTaskItem } from "../../models/dashboard-task-item";
import { DashboardService } from "../../services/dashboard.service";
import { Observable, Subject } from "rxjs";
import { StatusesStatisticsInfo } from "../../models/statuses-statistics";
import { takeUntil, tap, withLatestFrom } from "rxjs/operators";
import { ActivatedRoute } from "@angular/router";
import { DashboardActions } from "../../actions/dashboard.actions";
import FetchStatusesStatistics = DashboardActions.FetchStatusesStatistics;
import { UxgPopoverComponent } from "uxg";
import { AgreementActionFilters } from "../../../../agreements/back-office/dictionaries/agreement-action-label";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  @Select(DashboardState.agreements) agreements$: Observable<Agreement[]>;
  @Select(DashboardState.tasks) tasks$: Observable<Agreement[]>;
  @Select(DashboardState.status) status$: Observable<StateStatus>;
  @Select(DashboardState.tasksTotalCount) tasksTotalCount$: Observable<number>;
  @Select(DashboardState.agreementsTotalCount) agreementsTotalCount$: Observable<number>;
  @Select(DashboardState.agreementsBar) agreementsBar$: Observable<DashboardTaskItem[]>;
  @Select(DashboardState.tasksBar) tasksBar$: Observable<DashboardTaskItem[]>;
  @Select(DashboardState.statusesStatistics) statusesStatistics$: Observable<StatusesStatisticsInfo>;

  @ViewChildren('viewPopover') viewPopover: QueryList<UxgPopoverComponent>;

  destroy$ = new Subject();
  view: DashboardView = "tasks";

  constructor(
    private dashboardService: DashboardService,
    private route: ActivatedRoute,
    public store: Store
  ) { }

  ngOnInit() {
    this.route.params.pipe(
      tap(() => this.store.dispatch(new FetchStatusesStatistics({}))),
      withLatestFrom(this.statusesStatistics$),
      takeUntil(this.destroy$)
    ).subscribe();

    this.switchView(this.view);
  }

  switchView(view: DashboardView) {
    view === 'tasks' ? this.store.dispatch(FetchTasks) : this.store.dispatch(FetchAgreements);
    this.view = view;
    this.viewPopover?.first.hide();
  }

  getQueryParams() {
    return {actions: JSON.stringify(AgreementActionFilters[18].type)};
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
