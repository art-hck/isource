import { Component } from '@angular/core';
import { BehaviorSubject, Observable } from "rxjs";
import { TechnicalCommercialProposalGroup } from "../../../common/models/technical-commercial-proposal-group";
import { delayWhen, scan, switchMap, tap, withLatestFrom } from "rxjs/operators";
import { ActivatedRoute } from "@angular/router";
import { TechnicalCommercialProposalService } from "../../services/technical-commercial-proposal.service";
import { Uuid } from "../../../../cart/models/uuid";
import { RequestState } from "../../states/request.state";
import { RequestActions } from "../../actions/request.actions";
import { UxgBreadcrumbsService } from "uxg";
import { Select, Store } from "@ngxs/store";
import { Request } from "../../../common/models/request";

@Component({
  selector: 'app-technical-commercial-proposal-group-view',
  templateUrl: './technical-commercial-proposal-group-view.component.html'
})
export class TechnicalCommercialProposalGroupViewComponent {
  @Select(RequestState.request) request$: Observable<Request>;
  requestId: Uuid;
  readonly newGroup$ = new BehaviorSubject<TechnicalCommercialProposalGroup>(null);

  readonly tcpGroups$: Observable<TechnicalCommercialProposalGroup[]> = this.route.params.pipe(
    tap(({ id }) => this.requestId = id),
    delayWhen(({ id }) => this.store.dispatch(new RequestActions.Fetch(id))),
    withLatestFrom(this.request$),
    tap(([p, { id, number }]) => this.bc.breadcrumbs = [
      { label: "Заявки", link: "/requests/customer" },
      { label: `Заявка №${number}`, link: `/requests/customer/${id}` },
      { label: 'Согласование ТКП', link: `/requests/customer/${this.requestId}/technical-commercial-proposals`},
    ]),
    switchMap(() => this.service.groupList(this.requestId)),
    switchMap(groups => this.newGroup$.pipe(scan((acc, group) => {
      if (group) {
        const i = acc.findIndex(({id}) => group?.id === id);
        i !== -1 ? acc[i] = group : acc.push(group);
      }

      return acc;
    }, groups))),
  );

  constructor(
    private bc: UxgBreadcrumbsService,
    private route: ActivatedRoute,
    private store: Store,
    public service: TechnicalCommercialProposalService
  ) {}
}
