import { Component, OnChanges, OnInit, OnDestroy, SimpleChanges, ViewChildren, QueryList } from '@angular/core';
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
import FetchStatusesStatistics = DashboardActions.FetchStatusesStatistics;
import { UxgPopoverComponent } from "uxg";

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

  @ViewChildren('viewPopover') viewPopover: QueryList<UxgPopoverComponent>;

  destroy$ = new Subject();
  view: DashboardView = "tasks";

  constructor(
    public store: Store
  ) { }

  ngOnInit() {
    this.switchView(this.view);
  }

  switchView(view: DashboardView) {
    view === 'tasks' ? this.store.dispatch(FetchTasks) : this.store.dispatch(FetchAgreements);
    this.view = view;
    this.viewPopover?.first.hide();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
