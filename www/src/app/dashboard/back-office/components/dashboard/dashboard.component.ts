import { Component, OnDestroy, OnInit } from '@angular/core';
import { DashboardService } from "../../services/dashboard.service";
import { Select, Store } from "@ngxs/store";
import { Observable, Subject } from "rxjs";
import { DashboardState } from "../../states/dashboard.state";
import { StatusesStatisticsInfo } from "../../models/statuses-statistics";
import { takeUntil, tap, withLatestFrom } from "rxjs/operators";
import { ActivatedRoute } from "@angular/router";
import { DashboardActions } from "../../actions/dashboard.actions";
import FetchStatusesStatistics = DashboardActions.FetchStatusesStatistics;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  @Select(DashboardState.statusesStatistics) statusesStatistics$: Observable<StatusesStatisticsInfo>;
  destroy$ = new Subject();

  constructor(
    private dashboardService: DashboardService,
    private route: ActivatedRoute,
    public store: Store,
  ) { }

  ngOnInit(): void {
    this.route.params.pipe(
      tap(() => this.store.dispatch(new FetchStatusesStatistics({}))),
      withLatestFrom(this.statusesStatistics$),
      takeUntil(this.destroy$)
    ).subscribe();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
