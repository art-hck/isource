import { Component, OnInit, OnDestroy, ViewChildren, QueryList, Input } from '@angular/core';
import { DashboardView } from "../../models/dashboard-view";
import { Select, Store } from "@ngxs/store";
import FetchTasks = DashboardActions.FetchTasks;
import FetchAgreements = DashboardActions.FetchAgreements;
import { Agreement } from "../../../../agreements/common/models/Agreement";
import { StateStatus } from "../../../../request/common/models/state-status";
import { DashboardCommonState } from "../../states/dashboard.state";
import { DashboardTaskItem } from "../../models/dashboard-task-item";
import { Observable, Subject } from "rxjs";
import { DashboardActions } from "../../actions/dashboard.actions";
import { UxgPopoverComponent } from "uxg";
import { AgreementActionFilters } from "../../../../agreements/back-office/dictionaries/agreement-action-label";

@Component({
  selector: 'app-dashboard-agreements',
  templateUrl: './dashboard-agreements.component.html',
  styleUrls: ['./dashboard-agreements.component.scss']
})
export class DashboardAgreementsComponent implements OnInit, OnDestroy {
  @Input() agreements$: Observable<Agreement[]>;
  @Input() tasks$: Observable<Agreement[]>;
  @Input() status$: Observable<StateStatus>;
  @Input() tasksTotalCount$: Observable<number>;
  @Input() agreementsTotalCount$: Observable<number>;
  @Input() agreementsBar$: Observable<DashboardTaskItem[]>;
  @Input() tasksBar$: Observable<DashboardTaskItem[]>;

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

  getQueryParams() {
    return {actions: JSON.stringify(AgreementActionFilters[18].type)};
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
