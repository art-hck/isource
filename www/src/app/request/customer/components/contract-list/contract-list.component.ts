import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from "@ngxs/store";
import { iif, Observable, of, Subject } from "rxjs";
import { Request } from "../../../common/models/request";
import { RequestState } from "../../states/request.state";
import { ContractState } from "../../states/contract.state";
import { Contract } from "../../../common/models/contract";
import { UxgBreadcrumbsService } from "uxg";
import { ActivatedRoute } from "@angular/router";
import { delayWhen, switchMap, tap, withLatestFrom } from "rxjs/operators";
import { ContractActions } from "../../actions/contract.actions";
import { RequestActions } from "../../actions/request.actions";
import { ContractStatus } from "../../../common/enum/contract-status";
import { StateStatus } from "../../../common/models/state-status";
import { Uuid } from "../../../../cart/models/uuid";
import Fetch = ContractActions.Fetch;
import Download = ContractActions.Download;
import Upload = ContractActions.Upload;
import Reject = ContractActions.Reject;
import Approve = ContractActions.Approve;

@Component({
  selector: 'app-contract-list',
  templateUrl: './contract-list.component.html',
  styleUrls: ['./contract-list.component.scss']
})
export class ContractListComponent implements OnInit, OnDestroy {
  @Select(RequestState.request) request$: Observable<Request>;
  @Select(RequestState.status) requestStatus$: Observable<StateStatus>;
  @Select(ContractState.contracts([ContractStatus.ON_APPROVAL])) contractsSentToReview$: Observable<Contract[]>;
  @Select(ContractState.contracts([ContractStatus.REJECTED])) contractsSendToEdit$: Observable<Contract[]>;
  @Select(ContractState.contracts([ContractStatus.APPROVED, ContractStatus.SIGNED])) contractsReviewed$: Observable<Contract[]>;
  @Select(ContractState.status) status$: Observable<StateStatus>;
  readonly destroy$ = new Subject();
  readonly download = (requestId: Uuid, contractId: Uuid) => new Download(requestId, contractId);
  readonly reject = (requestId: Uuid, contractId: Uuid, file: File, comment?: string) => new Reject(requestId, contractId, file, comment);
  readonly approve = (requestId: Uuid, contractId: Uuid) => new Approve(requestId, contractId);

  constructor(
    public store: Store,
    private bc: UxgBreadcrumbsService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.route.params.pipe(
      delayWhen(({ id }) => this.store.dispatch([new Fetch(id), new RequestActions.Fetch(id)])),
      withLatestFrom(this.request$),
      tap(([p, { id, number }]) => this.bc.breadcrumbs = [
        { label: "Заявки", link: "/requests/customer" },
        { label: `Заявка №${number}`, link: `/requests/customer/${id}` },
        { label: 'Согласование договора', link: `/requests/customer/${id}/contracts`},
      ]),
    ).subscribe();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
