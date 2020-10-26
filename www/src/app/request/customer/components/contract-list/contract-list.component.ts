import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Select, Store } from "@ngxs/store";
import { RequestState } from "../../states/request.state";
import { BehaviorSubject, combineLatest, Observable, Subject } from "rxjs";
import { Request } from "../../../common/models/request";
import { StateStatus } from "../../../common/models/state-status";
import { ContractState } from "../../states/contract.state";
import { delayWhen, map, takeUntil, tap, withLatestFrom } from "rxjs/operators";
import { ContractActions } from "../../actions/contract.actions";
import { ActivatedRoute } from "@angular/router";
import { RequestActions } from "../../actions/request.actions";
import { UxgBreadcrumbsService } from "uxg";
import { Contract } from "../../../common/models/contract";
import { FormBuilder } from "@angular/forms";
import { ContractFilter } from "../../../common/models/contract-filter";
import { ContractStatusLabels } from "../../../common/dictionaries/contract-status-labels";
import { ContractStatus } from "../../../common/enum/contract-status";
import { FilterComponent } from "../../../../shared/components/filter/filter.component";
import { FilterCheckboxList } from "../../../../shared/components/filter/filter-checkbox-item";
import { Uuid } from "../../../../cart/models/uuid";
import { searchContragents } from "../../../../shared/helpers/search";
import Fetch = ContractActions.Fetch;
import Download = ContractActions.Download;
import Reject = ContractActions.Reject;
import Approve = ContractActions.Approve;
import Filter = ContractActions.Filter;
import FetchAvailibleFilters = ContractActions.FetchAvailibleFilters;

@Component({
  selector: 'app-contract-list',
  templateUrl: './contract-list.component.html'
})
export class ContractListComponent implements OnInit, OnDestroy {
  @ViewChild('filterRef') filterRef: FilterComponent;
  @Select(RequestState.request) request$: Observable<Request>;
  @Select(RequestState.status) requestStatus$: Observable<StateStatus>;
  @Select(ContractState.availibleFilters) availibleFilters$: Observable<ContractFilter>;
  @Select(ContractState.contractsLength) contractsLength$: Observable<number>;
  @Select(ContractState.contracts([ContractStatus.ON_APPROVAL])) contractsSentToReview$: Observable<Contract[]>;
  @Select(ContractState.contracts([ContractStatus.REJECTED])) contractsSendToEdit$: Observable<Contract[]>;
  @Select(ContractState.contracts([ContractStatus.APPROVED, ContractStatus.SIGNED])) contractsReviewed$: Observable<Contract[]>;
  @Select(ContractState.status) status$: Observable<StateStatus>;
  readonly form = this.fb.group({ positionName: "", suppliers: [], statuses: [] });
  readonly destroy$ = new Subject();
  readonly suppliersSearch$ = new BehaviorSubject<string>("");

  readonly contractSuppliersItems$: Observable<FilterCheckboxList<Uuid>> = combineLatest([this.suppliersSearch$, this.availibleFilters$]).pipe(
    map(([q, f]) => searchContragents(q, f?.suppliers ?? []).map((c) => ({ label: c.shortName, value: c.id })))
  );
  readonly contractStatusesItems$: Observable<FilterCheckboxList<ContractStatus>> = this.availibleFilters$.pipe(
    map(({ statuses }) => statuses?.map(value => ({ label: ContractStatusLabels[value], value }))),
  );
  readonly download = (contract: Contract) => new Download(contract);
  readonly reject = (request: Request, contract: Contract, files: File[], comment?: string) => new Reject(request.id, contract, files, comment);
  readonly approve = (request: Request, contract: Contract) => new Approve(request.id, contract);
  readonly filter = (request: Request, value: ContractFilter<Uuid>) => new Filter(request.id, value);

  constructor(
    public store: Store,
    private bc: UxgBreadcrumbsService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.route.params.pipe(
      tap(({ id }) => this.store.dispatch([new Fetch(id), new FetchAvailibleFilters(id)])),
      delayWhen(({ id }) => this.store.dispatch(new RequestActions.Fetch(id))),
      withLatestFrom(this.request$),
      tap(([, { id, number }]) => this.bc.breadcrumbs = [
        { label: "Заявки", link: "/requests/customer" },
        { label: `Заявка №${number}`, link: `/requests/customer/${id}` },
        { label: 'Согласование договора', link: `/requests/customer/${id}/contracts`},
      ]),
    ).subscribe();

    this.form.valueChanges
      .pipe(withLatestFrom(this.route.params), takeUntil(this.destroy$))
      .subscribe(([value, { id }]) => this.store.dispatch(new Filter(id, value)));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
