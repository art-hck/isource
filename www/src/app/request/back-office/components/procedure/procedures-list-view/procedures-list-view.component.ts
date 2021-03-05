import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from "rxjs";
import { Select, Store } from "@ngxs/store";
import { DashboardState } from "../../../../../dashboard/back-office/states/dashboard.state";
import { Procedure } from "../../../models/procedure";
import { takeUntil, tap } from "rxjs/operators";
import { ActivatedRoute } from "@angular/router";
import { DashboardActions } from "../../../../../dashboard/back-office/actions/dashboard.actions";
import FetchProcedures = DashboardActions.FetchProcedures;

@Component({
  selector: 'app-procedures-list-view',
  templateUrl: './procedures-list-view.component.html'
})
export class ProceduresListViewComponent implements OnDestroy, OnInit {

  @Select(DashboardState.procedures) procedures$: Observable<Procedure[]>;

  readonly destroy$ = new Subject();

  constructor(
    private route: ActivatedRoute,
    public store: Store
  ) { }

  ngOnInit(): void {
    this.route.params.pipe(
      // pageSize: 999 временное решение, будет исправлено после прикручивания пагинатора
      tap(() => this.store.dispatch([new FetchProcedures({ startFrom: 0, pageSize: 999, filters: {} })])),
      takeUntil(this.destroy$)
    ).subscribe();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
