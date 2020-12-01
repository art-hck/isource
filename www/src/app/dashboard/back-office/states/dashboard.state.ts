import { StateStatus } from "../../../request/common/models/state-status";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { Injectable } from "@angular/core";
import { DashboardActions } from "../actions/dashboard.actions";
import FetchTasks = DashboardActions.FetchTasks;
import { patch } from "@ngxs/store/operators";
import { tap } from "rxjs/operators";
import { DashboardService } from "../services/dashboard.service";
import FetchAgreements = DashboardActions.FetchAgreements;
import { DashboardTasks } from "../models/dashboard-tasks";
import { DashboardService } from "../services/dashboard.service";
import { patch } from "@ngxs/store/operators";
import { tap } from "rxjs/operators";
import { DashboardActions } from "../actions/dashboard.actions";
import { StatusesStatisticsInfo } from "../models/statuses-statistics";
import FetchStatusesStatistics = DashboardActions.FetchStatusesStatistics;

export interface DashboardStateModel {
  tasks: DashboardTasks;
  agreements: DashboardTasks;
  statusesStatistics: StatusesStatisticsInfo;
  status: StateStatus;
}

type Model = DashboardStateModel;
type Context = StateContext<Model>;

@State<Model>({
  name: 'BackofficeDashboard',
  defaults: { tasks: null, agreements: null, statusesStatistics: null, status: "pristine" }
})
@Injectable()
export class DashboardState {
  constructor(private rest: DashboardService) {}

  @Selector()
  static agreements({ agreements }: Model) { return agreements.entities; }

  @Selector()
  static tasks({ tasks }: Model) { return tasks.entities; }

  @Selector()
  static tasksBar({ tasks }: Model) { return tasks.dashboard; }

  @Selector()
  static agreementsBar({ agreements }: Model) { return agreements.dashboard; }

  @Selector()
  static tasksTotalCount({ tasks }: Model) { return tasks.totalCount; }

  @Selector()
  static agreementsTotalCount({ agreements }: Model) { return agreements.totalCount; }

  @Selector()
  static statusesStatistics({ statusesStatistics }: Model) { return statusesStatistics; }

  @Selector()
  static status({ status }: Model) { return status; }

  @Action(FetchTasks) fetchTasks({setState}: Context) {
    setState(patch({ status: "fetching" as StateStatus }));
    return this.rest.getTasks().pipe(
      tap(tasks => setState(patch({ tasks, status: "received" as StateStatus }))),
    );
  }

  @Action(FetchAgreements) fetchAgreements({setState}: Context) {
    setState(patch({ status: "fetching" as StateStatus }));
    return this.rest.getAgreements().pipe(
      tap(agreements => setState(patch({ agreements, status: "received" as StateStatus }))),
    );
  }

  @Action(FetchStatusesStatistics)
  fetchStatusesStatistics({ setState, dispatch }: Context, { filters }: FetchStatusesStatistics) {
    setState(patch<Model>({ status: 'fetching', statusesStatistics: null }));

    return this.rest.getStatusesStatistics(filters).pipe(tap(statusesStatistics => setState(patch<Model>({ statusesStatistics, status: "received" }))));
  }
}
