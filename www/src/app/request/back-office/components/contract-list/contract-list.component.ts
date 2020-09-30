import { Component, OnInit } from '@angular/core';
import { Select, Store } from "@ngxs/store";
import { RequestState } from "../../states/request.state";
import { Observable, Subject } from "rxjs";
import { Request } from "../../../common/models/request";
import { StateStatus } from "../../../common/models/state-status";
import { ContractState } from "../../states/contract.state";
import { ContragentWithPositions } from "../../../common/models/contragentWithPositions";
import { takeUntil, tap } from "rxjs/operators";
import { ContractActions } from "../../actions/contract.actions";
import { Uuid } from "../../../../cart/models/uuid";
import { ActivatedRoute } from "@angular/router";
import { RequestActions } from "../../actions/request.actions";
import GetContragentsWithPositions = ContractActions.GetContragentsWithPositions;

@Component({
  selector: 'app-contract-list',
  templateUrl: './contract-list.component.html',
  styleUrls: ['./contract-list.component.scss']
})
export class ContractListComponent implements OnInit {
  @Select(RequestState.request) request$: Observable<Request>;
  @Select(ContractState.contragentWithPositions) contragentWithPositions$: Observable<ContragentWithPositions[]>;
  @Select(ContractState.status) status$: Observable<StateStatus>;

  requestId: Uuid;

  readonly destroy$ = new Subject();

  constructor(
    public route: ActivatedRoute,
    public store: Store) {
  }

  ngOnInit() {
    this.route.params.pipe(
      tap(({id}) => this.requestId = id),
      tap(({id}) => this.store.dispatch([new GetContragentsWithPositions(id), new RequestActions.Fetch(id)])),
      takeUntil(this.destroy$)
    ).subscribe();
  }
}
