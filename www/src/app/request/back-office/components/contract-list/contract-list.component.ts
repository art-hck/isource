import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from "@ngxs/store";
import { RequestState } from "../../states/request.state";
import { BehaviorSubject, Observable, Subject } from "rxjs";
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
import { ContragentList } from "../../../../contragent/models/contragent-list";
import { ContractStatusLabels } from "../../../common/dictionaries/contract-status-labels";
import { ContragentWithPositions } from "../../../common/models/contragentWithPositions";
import FetchSuppliers = ContractActions.FetchSuppliers;
import Fetch = ContractActions.Fetch;
import Send = ContractActions.Send;
import Rollback = ContractActions.Rollback;
import Download = ContractActions.Download;
import Sign = ContractActions.Sign;
import Delete = ContractActions.Delete;
import Filter = ContractActions.Filter;
import FetchAvailibleFilters = ContractActions.FetchAvailibleFilters;

@Component({
  selector: 'app-contract-list',
  templateUrl: './contract-list.component.html'
})
export class ContractListComponent implements OnInit, OnDestroy {
  @Select(RequestState.request) request$: Observable<Request>;
  @Select(RequestState.status) requestStatus$: Observable<StateStatus>;
  @Select(ContractState.suppliers) suppliers$: Observable<ContragentWithPositions[]>;
  @Select(ContractState.contracts) contracts$: Observable<Contract[]>;
  @Select(ContractState.status) status$: Observable<StateStatus>;
  @Select(ContractState.availibleFilters) availibleFilters$: Observable<ContractFilter>;

  readonly form = this.fb.group({ positionName: "", suppliers: [], statuses: [] });
  readonly destroy$ = new Subject();
  readonly contractSuppliersSearch$ = new BehaviorSubject<string>("");
  readonly contractSuppliersItems$ = this.contractSuppliersSearch$.pipe(
    withLatestFrom(this.availibleFilters$),
    map(([q, { suppliers }]) => suppliers
      .filter((supplier: ContragentList) => supplier.shortName.toLowerCase().indexOf(q.toLowerCase()) > -1 || supplier.inn.indexOf(q) > -1)
      .map((supplier: ContragentList) => ({ label: supplier.shortName, value: supplier.id }))),
  );
  readonly contractStatusesItems$ = this.availibleFilters$.pipe(
    map(({ statuses }) => statuses.map(value => ({ label: ContractStatusLabels[value], value }))),
  );
  readonly send = (contract: Contract, files?: File[], comment?: string) => new Send(contract, files, comment);
  readonly sign = (contract: Contract) => new Sign(contract);
  readonly rollback = (contract: Contract) => new Rollback(contract);
  readonly download = (contract: Contract) => new Download(contract);
  readonly delete = (contract: Contract) => new Delete(contract);

  constructor(
    public store: Store,
    private bc: UxgBreadcrumbsService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.route.params.pipe(
      tap(({ id }) => this.store.dispatch([new Fetch(id), new FetchAvailibleFilters(id), new FetchSuppliers(id)])),
      delayWhen(({ id }) => this.store.dispatch(new RequestActions.Fetch(id))),
      withLatestFrom(this.request$),
      tap(([p, { id, number }]) => this.bc.breadcrumbs = [
        { label: "Заявки", link: "/requests/backoffice" },
        { label: `Заявка №${ number }`, link: `/requests/backoffice/${ id }` },
        { label: 'Согласование договора', link: `/requests/backoffice/${ id }/contracts` },
      ]),
      takeUntil(this.destroy$)
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
