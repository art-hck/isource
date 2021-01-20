import { Component, OnInit, OnDestroy, ViewChildren, QueryList, ViewChild } from '@angular/core';
import { Select, Store } from "@ngxs/store";
import { Agreement } from "../../../../agreements/common/models/Agreement";
import { StateStatus } from "../../../../request/common/models/state-status";
import { DashboardState } from "../../states/dashboard.state";
import { Observable, Subject } from "rxjs";
import { DashboardTaskItem } from "../../../common/models/dashboard-task-item";
import { UserInfoService } from "../../../../user/service/user-info.service";
import { DashboardActions } from "../../actions/dashboard.actions";
import Fetch = DashboardActions.Fetch;
import { DashboardView } from "../../../back-office/models/dashboard-view";

@Component({
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  @Select(DashboardState.agreements) agreements$: Observable<Agreement[]>;
  @Select(DashboardState.status) status$: Observable<StateStatus>;
  @Select(DashboardState.agreementsTotalCount) agreementsTotalCount$: Observable<number>;
  @Select(DashboardState.agreementsBar) agreementsBar$: Observable<DashboardTaskItem[]>;

  view: DashboardView = "agreements";

  constructor(
    public store: Store,
    public user: UserInfoService
  ) { }

  ngOnInit() {
    this.store.dispatch(new Fetch());
  }
}
