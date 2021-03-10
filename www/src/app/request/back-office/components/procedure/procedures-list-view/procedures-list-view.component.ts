import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, Subject } from "rxjs";
import { Select, Store } from "@ngxs/store";
import { DashboardState } from "../../../../../dashboard/back-office/states/dashboard.state";
import { Procedure } from "../../../models/procedure";
import { debounceTime, map, scan, switchMap, takeUntil, tap } from "rxjs/operators";
import { ActivatedRoute, Router } from "@angular/router";
import { DashboardActions } from "../../../../../dashboard/back-office/actions/dashboard.actions";
import FetchProcedures = DashboardActions.FetchProcedures;
import FetchProceduresAvailableFilters = DashboardActions.FetchProceduresAvailableFilters;
import { FormBuilder } from "@angular/forms";
import { APP_CONFIG, GpnmarketConfigInterface } from "../../../../../core/config/gpnmarket-config.interface";
import { Okpd2Item } from "../../../../../core/models/okpd2-item";
import { UxgFilterCheckboxList } from "uxg";
import { Uuid } from "../../../../../cart/models/uuid";
import { searchContragents } from "../../../../../shared/helpers/search";
import { ContragentShortInfo } from "../../../../../contragent/models/contragent-short-info";
import { StateStatus } from "../../../../common/models/state-status";
import { ProceduresStatusList } from "../../../models/procedures-status-list";
import { ProceduresFilter } from "../../../models/procedures-filter";

@Component({
  selector: 'app-procedures-list-view',
  templateUrl: './procedures-list-view.component.html'
})
export class ProceduresListViewComponent implements OnDestroy, OnInit {

  @Select(DashboardState.status) status$: Observable<StateStatus>;
  @Select(DashboardState.procedures) procedures$: Observable<Procedure[]>;
  @Select(DashboardState.proceduresTotalCount) proceduresTotalCount$: Observable<number>;
  @Select(DashboardState.proceduresFilterAvailableOkpd2List) availableOkpd2List$: Observable<Okpd2Item[]>;
  @Select(DashboardState.proceduresFilterAvailableStatusesList) availableStatusesList$: Observable<ProceduresStatusList[]>;
  @Select(DashboardState.proceduresFilterAvailableContragentList) availableContragentList$: Observable<ContragentShortInfo[]>;

  readonly filterForm = this.fb.group({
    procedureId: '',
    procedureTitle: '',
    okpd2: null,
    customersIds: [[]],
    purchaseForm: null,
    statuses: [[]],
    isRetrade: false,
    datePublishedFrom: null,
    datePublishedTo: null,
    dateEndRegistrationFrom: null,
    dateEndRegistrationTo: null,
    dateSummingUpFrom: null,
    dateSummingUpTo: null,
  });

  readonly pageSize = this.appConfig.paginator.pageSize;
  readonly pages$ = this.route.queryParams.pipe(map(params => +params["page"]));
  readonly fetchFilters$ = new Subject<{ page?: number, pageSize?: number, filters?: ProceduresFilter }>();
  readonly destroy$ = new Subject();
  readonly contragentsSearch$ = new BehaviorSubject<string>("");
  readonly contragentsFilter$: Observable<UxgFilterCheckboxList<Uuid>> = combineLatest([this.contragentsSearch$, this.availableContragentList$]).pipe(
    map(([q, f]) => {
      return searchContragents(q, f || []).map(c => ({ label: c.shortName, value: c.id }));
    })
  );

  searchOkpd2 = (query, items: Okpd2Item[]) => items;
  readonly getOkpd2Name = ({ name }) => name;

  constructor(
    @Inject(APP_CONFIG) private appConfig: GpnmarketConfigInterface,
    private route: ActivatedRoute,
    public store: Store,
    private router: Router,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.fetchFilters$.pipe(
      debounceTime(100),
      tap(({ page }) => {
        if (!page) { this.router.navigate(["."], { relativeTo: this.route, queryParams: null }); }
      }),
      scan(({ filters: prev }, { page = 1, filters: curr }) => {
        const filters = { ...prev, ...curr };
        return ({ page, filters });
      }, {} as { page?: number, filters?: ProceduresFilter }),
      switchMap(data => {
        const filters = { startFrom: (data.page - 1) * this.pageSize, pageSize: this.pageSize, filters: data.filters };
        return this.store.dispatch(new FetchProcedures(filters));
      }),
      takeUntil(this.destroy$)
    ).subscribe();

    this.store.dispatch(new FetchProceduresAvailableFilters({}));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
