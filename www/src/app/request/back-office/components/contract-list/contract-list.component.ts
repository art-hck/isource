import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from "@ngxs/store";
import { RequestState } from "../../states/request.state";
import { Observable, Subject } from "rxjs";
import { Request } from "../../../common/models/request";
import { StateStatus } from "../../../common/models/state-status";
import { ContractState } from "../../states/contract.state";
import { ContragentWithPositions } from "../../../common/models/contragentWithPositions";
import { delayWhen, takeUntil, tap, withLatestFrom } from "rxjs/operators";
import { ContractActions } from "../../actions/contract.actions";
import { ActivatedRoute } from "@angular/router";
import { RequestActions } from "../../actions/request.actions";
import { UxgBreadcrumbsService } from "uxg";
import { Contract } from "../../../common/models/contract";
import FetchSuppliers = ContractActions.FetchSuppliers;
import Fetch = ContractActions.Fetch;
import Send = ContractActions.Send;
import { Uuid } from "../../../../cart/models/uuid";
import Rollback = ContractActions.Rollback;

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
  readonly destroy$ = new Subject();
  readonly send = (requestId: Uuid, contractId: Uuid, file?: File, comment?: string) => new Send(requestId, contractId, file, comment);
  readonly rollback = (contractId: Uuid) => new Rollback(contractId);

  constructor(
    public store: Store,
    private bc: UxgBreadcrumbsService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.route.params.pipe(
      tap(({ id }) => this.store.dispatch([new Fetch(id), new FetchSuppliers(id)])),
      delayWhen(({ id }) => this.store.dispatch(new RequestActions.Fetch(id))),
      withLatestFrom(this.request$),
      tap(([p, { id, number }]) => this.bc.breadcrumbs = [
        { label: "Заявки", link: "/requests/backoffice" },
        { label: `Заявка №${ number }`, link: `/requests/backoffice/${ id }` },
        { label: 'Согласование договора', link: `/requests/backoffice/${ id }/contracts` },
      ]),
      takeUntil(this.destroy$)
    ).subscribe();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
