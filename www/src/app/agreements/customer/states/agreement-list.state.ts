import { Page } from "../../../core/models/page";
import { RequestStatusCount } from "../../../request/common/models/requests-list/request-status-count";
import { StateStatus } from "../../../request/common/models/state-status";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { Injectable } from "@angular/core";
import { patch } from "@ngxs/store/operators";
import { tap } from "rxjs/operators";
import { AgreementsService } from "../services/agreements.service";
import { AgreementsResponse } from "../../common/models/agreements-response";
import { AgreementListActions } from "../actions/agreement-list.actions";
import Fetch = AgreementListActions.Fetch;
import { RequestPosition } from "../../../request/common/models/request-position";

export interface AgreementListStateModel {
  agreements: Page<RequestPosition>;
  statusCounts: number;
  status: StateStatus;
}

type Model = AgreementListStateModel;
type Context = StateContext<Model>;

@State<Model>({
  name: 'CustomerAgreementList',
  defaults: { agreements: null, statusCounts: null, status: "pristine" }
})
@Injectable()
export class AgreementListState {
  constructor(private rest: AgreementsService) {}

  @Selector()
  static agreements({ agreements }: Model) { return agreements.entities; }

  @Selector()
  static totalCount({ agreements }: Model) { return agreements.totalCount; }

  @Selector()
  static status({ status }: Model) { return status; }

  @Action(Fetch, { cancelUncompleted: true }) fetch({ setState }: Context, {startFrom, pageSize}: Fetch) {
    setState(patch({ status: "fetching" as StateStatus }));
    return this.rest.getAgreements(startFrom, pageSize).pipe(
      tap(agreements => setState(patch({ agreements, status: "received" as StateStatus }))),
    );
  }
}
