import { StateStatus } from "../../../request/common/models/state-status";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { Injectable } from "@angular/core";
import { DashboardActions } from "../actions/dashboard.actions";
import { patch } from "@ngxs/store/operators";
import { tap } from "rxjs/operators";
import { DashboardService } from "../services/dashboard.service";

import Fetch = DashboardActions.Fetch;
import { DashboardTasks } from "../../back-office/models/dashboard-tasks";

export interface DashboardStateModel {
  agreements: DashboardTasks;
  status: StateStatus;
}

type Model = DashboardStateModel;
type Context = StateContext<Model>;

@State<Model>({
  name: 'CustomerDashboard',
  defaults: { agreements: null, status: "pristine" }
})
@Injectable()
export class DashboardState {
  constructor(private rest: DashboardService) {}

  @Selector()
  static agreements({ agreements }: Model) { return agreements.entities; }

  @Selector()
  static agreementsBar({ agreements }: Model) { return agreements.dashboard; }

  @Selector()
  static agreementsTotalCount({ agreements }: Model) { return agreements.totalCount; }

  @Selector()
  static status({ status }: Model) { return status; }

  @Action(Fetch) fetchAgreements({setState}: Context) {
    setState(patch({ status: "fetching" as StateStatus }));
    return this.rest.getAgreements().pipe(
      tap(agreements => setState(patch({ agreements, status: "received" as StateStatus }))),
    );
  }
}
