import { DOCUMENT, getCurrencySymbol, isPlatformBrowser } from "@angular/common";
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, InjectionToken, OnDestroy, OnInit, PLATFORM_ID, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FeatureService } from "../../../../core/services/feature.service";
import { FormArray, FormBuilder } from "@angular/forms";
import { debounceTime, delayWhen, filter, map, mapTo, mergeAll, scan, startWith, switchMap, takeUntil, tap, withLatestFrom } from "rxjs/operators";
import { ActivatedRoute, Router } from "@angular/router";
import { BehaviorSubject, merge, Observable, Subject } from "rxjs";
import { RequestsListFilter } from "../../../common/models/requests-list/requests-list-filter";
import { RequestsListSort } from "../../../common/models/requests-list/requests-list-sort";
import { Select, Store } from "@ngxs/store";
import { RequestsList } from "../../../common/models/requests-list/requests-list";
import { RequestListState } from "../../states/request-list.state";
import { RequestListActions } from "../../actions/request-list.actions";
import { StateStatus } from "../../../common/models/state-status";
import { RequestStatusCount } from "../../../common/models/requests-list/request-status-count";
import { PositionStatus } from "../../../common/enum/position-status";
import { APP_CONFIG, GpnmarketConfigInterface } from "../../../../core/config/gpnmarket-config.interface";
import { UxgFilterCheckboxList, UxgFooterComponent, UxgTabTitleComponent } from "uxg";
import { CustomValidators } from "../../../../shared/forms/custom.validators";
import { ToastActions } from "../../../../shared/actions/toast.actions";
import moment from "moment";
import { AvailableFilters } from "../../../common/models/requests-list/available-filters";
import { PositionStatusesLabels } from "../../../common/dictionaries/position-statuses-labels";
import { Uuid } from "../../../../cart/models/uuid";
import { searchUsers } from "../../../../shared/helpers/search";
import { PluralizePipe } from "../../../../shared/pipes/pluralize-pipe";
import { RequestListItem } from "../../../common/models/requests-list/requests-list-item";
import Fetch = RequestListActions.Fetch;
import FetchAvailableFilters = RequestListActions.FetchAvailableFilters;
import Review = RequestListActions.Review;

@Component({
  templateUrl: './request-list.component.html',
  styleUrls: ['./request-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [PluralizePipe]
})
export class RequestListComponent implements AfterViewInit, OnDestroy, OnInit {
  @ViewChild(UxgFooterComponent, { read: ElementRef }) footerRef: ElementRef;
  @ViewChild('approvedTab') approvedTab: UxgTabTitleComponent;
  @ViewChildren(UxgTabTitleComponent) tabTitleComponents: QueryList<UxgTabTitleComponent>;
  @Select(RequestListState.requests) requests$: Observable<RequestsList[]>;
  @Select(RequestListState.statusCounters) statusCounters$: Observable<RequestStatusCount>;
  @Select(RequestListState.tabTotalCount) tabTotalCount$: Observable<number>;
  @Select(RequestListState.totalCount) totalCount$: Observable<number>;
  @Select(RequestListState.status) status$: Observable<StateStatus>;
  @Select(RequestListState.availableFilters) availableFilters$: Observable<AvailableFilters>;

  readonly pageSize = this.appConfig.paginator.pageSize;
  readonly fetchFilters$ = new Subject<{ page?: number, filters?: RequestsListFilter, sort?: RequestsListSort }>();
  readonly pages$ = this.route.queryParams.pipe(map(params => +params["page"]));
  readonly destroy$ = new Subject();
  readonly review$ = new Subject<boolean>();
  readonly form = this.fb.group({
    checked: false,
    requests: this.fb.array([], CustomValidators.oneOrMoreSelected)
  });
  readonly filterForm = this.fb.group({
    requestNameOrNumber: '',
    shipmentDateFrom: '',
    shipmentDateTo: '',
    shipmentDateAsap: false,
    userIds: [[]],
  });
  readonly getCurrencySymbol = getCurrencySymbol;
  readonly PositionStatusesLabels = PositionStatusesLabels;
  readonly usersSearch$ = new BehaviorSubject<string>("");
  users$: Observable<UxgFilterCheckboxList<Uuid>>;

  get formRequests(): FormArray {
    return this.form.get("requests") as FormArray;
  }

  readonly selectedRequests$: Observable<RequestListItem[]> = this.formRequests.valueChanges.pipe(map(() => {
    return this.formRequests.controls.filter(form => form.get('checked').value).map(form => form.get('request').value);
  }));

  constructor(
    @Inject(APP_CONFIG) private appConfig: GpnmarketConfigInterface,
    @Inject(DOCUMENT) private document,
    @Inject(PLATFORM_ID) private platformId: InjectionToken<Object>,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
    private pluralize: PluralizePipe,
    public store: Store,
    public feature: FeatureService,
  ) {}

  ngOnInit() {
    // Build form
    this.requests$.pipe(takeUntil(this.destroy$)).subscribe(requests => {
      this.formRequests.controls = []; // can't use clear() coz https://github.com/angular/angular/issues/23336
      requests?.map(({ request }) => this.fb.group({ checked: false, request })).forEach(formGroup => {
        this.formRequests.controls.push(formGroup); // https://github.com/angular/angular/issues/23336#issuecomment-543209703
        this.formRequests['_registerControl'](formGroup);
      });
    });

    // Review actions
    this.review$.pipe(
      tap(() => this.form.disable()),
      withLatestFrom(this.selectedRequests$),
      delayWhen(([approved, requests]) => this.store.dispatch(new Review(approved, requests.map(({ id }) => id)))),
      tap(() => this.fetchFilters$.next({})),
      tap(([approved, requests]) => approved ? this.store.dispatch(new ToastActions.Success(
        `Успешно согласовано ${this.pluralize.transform(requests.length, "заявка", "заявки", "заявок")}`
      )) : this.store.dispatch(new ToastActions.Success(
        `Отклонено ${this.pluralize.transform(requests.length, "заявка", "заявки", "заявок")}`)),
      takeUntil(this.destroy$)
    )).subscribe();

    // Getting data
    this.fetchFilters$.pipe(
      debounceTime(100),
      tap(({ page }) => {
        if (!page) {
          this.router.navigate(["."], { relativeTo: this.route, queryParams: null });
        }
      }),
      scan(({ filters: prev, sort: prevSort }, { page = 1, filters: curr, sort: currSort }) => {
        const filters = { ...prev, ...curr };
        filters.shipmentDateFrom = this.dateOrNull(filters.shipmentDateFrom);
        filters.shipmentDateTo = this.dateOrNull(filters.shipmentDateTo);
        return ({ page, filters, sort: { ...prevSort, ...currSort } });
      }, {} as { page?: number, filters?: RequestsListFilter, sort?: RequestsListSort }),
      switchMap(data => this.store.dispatch(new Fetch((data.page - 1) * this.pageSize, this.pageSize, data.filters, data.sort))),
      tap(() => this.form.enable()),
      takeUntil(this.destroy$)
    ).subscribe();

    this.store.dispatch(new FetchAvailableFilters());

    this.users$ = this.availableFilters$ && this.usersSearch$.pipe(
      switchMap(q => this.availableFilters$.pipe(
        map(f => searchUsers(q, f?.users ?? []).map(u => ({ label: u.shortName, value: u.id }))
        ))),
      tap(() => this.cd.detectChanges())
    );
  }

  clickOnTab(isReviewedTab: boolean) {
    const filters = { positionStatuses: [], positionNotStatuses: [] };
    filters[isReviewedTab ? 'positionNotStatuses' : 'positionStatuses'] = (isReviewedTab ?
      [PositionStatus.PROOF_OF_NEED, PositionStatus.DRAFT] : [PositionStatus.PROOF_OF_NEED])
    ;

    this.fetchFilters$.next({ filters });
  }

  ngAfterViewInit() {
    merge(this.tabTitleComponents.map(tab => tab.toggle.pipe(startWith(tab.active), filter(Boolean), mapTo(tab)))).pipe(
      mergeAll(),
      takeUntil(this.destroy$)
    ).subscribe(tab => this.clickOnTab(tab.id === 'approved'));

    if (isPlatformBrowser(this.platformId)) {
      const footerEl = this.document.querySelector('.app-footer');
      footerEl?.parentElement.insertBefore(this.footerRef.nativeElement, footerEl);
    }
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId)) {
      this.footerRef.nativeElement.remove();
    }

    this.destroy$.next();
    this.destroy$.complete();
  }

  private dateOrNull = (date) => date ? moment(date, 'DD.MM.YYYY').format('YYYY-MM-DD') : null;
}
