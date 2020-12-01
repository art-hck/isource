import { StateStatus } from "../../../request/common/models/state-status";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { Injectable } from "@angular/core";
import { DashboardService } from "../services/dashboard.service";
import { patch } from "@ngxs/store/operators";
import { tap } from "rxjs/operators";
import { DashboardActions } from "../actions/dashboard.actions";
import { StatusesStatisticsInfo } from "../models/statuses-statistics";
import FetchStatusesStatistics = DashboardActions.FetchStatusesStatistics;

export interface DashboardStateModel {
  statusesStatistics: StatusesStatisticsInfo;
  status: StateStatus;
}

type Model = DashboardStateModel;
type Context = StateContext<Model>;

@State<Model>({
  name: 'BackofficeDashboard',
  defaults: { statusesStatistics: null, status: "pristine" }
})
@Injectable()
export class DashboardState {

  constructor(private rest: DashboardService) {}

  @Selector() static statusesStatistics({ statusesStatistics }: Model) { return statusesStatistics; }
  @Selector() static status({ status }: Model) { return status; }

  @Action(FetchStatusesStatistics)
  fetchStatusesStatistics({ setState, dispatch }: Context, { filters }: FetchStatusesStatistics) {
    setState(patch<Model>({ status: 'fetching', statusesStatistics: null }));

    return this.rest.getStatusesStatistics(filters).pipe(tap(statusesStatistics => setState(patch<Model>({ statusesStatistics, status: "received" }))));
  }
}
