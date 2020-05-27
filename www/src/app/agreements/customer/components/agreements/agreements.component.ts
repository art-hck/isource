import { Component, Inject, OnInit } from '@angular/core';
import { Select, Store } from "@ngxs/store";
import { Observable } from "rxjs";
import { StateStatus } from "../../../../request/common/models/state-status";
import { AgreementListState } from "../../states/agreement-list.state";
import { AgreementListActions } from "../../actions/agreement-list.actions";
import Fetch = AgreementListActions.Fetch;
import { RequestPosition } from "../../../../request/common/models/request-position";
import { APP_CONFIG, GpnmarketConfigInterface } from "../../../../core/config/gpnmarket-config.interface";
import { map } from "rxjs/operators";
import { ActivatedRoute } from "@angular/router";

@Component({
  templateUrl: './agreements.component.html',
  styleUrls: ['./agreements.component.scss']
})
export class AgreementsComponent implements OnInit {
  @Select(AgreementListState.agreements) agreements$: Observable<RequestPosition[]>;
  @Select(AgreementListState.status) status$: Observable<StateStatus>;
  @Select(AgreementListState.totalCount) totalCount$: Observable<number>;

  readonly pageSize = this.appConfig.paginator.pageSize;
  pages$: Observable<number>;

  constructor(
    @Inject(APP_CONFIG) private appConfig: GpnmarketConfigInterface,
    public store: Store,
    public route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.pages$ = this.route.queryParams.pipe(map(params => +params["page"]));
    this.store.dispatch(new Fetch());
  }

  loadPage(page: number) {
    this.store.dispatch(new Fetch(page, this.pageSize));
  }
}
