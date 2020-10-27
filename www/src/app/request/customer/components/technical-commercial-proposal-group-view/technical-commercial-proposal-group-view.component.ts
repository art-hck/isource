import { Component } from '@angular/core';
import { BehaviorSubject, Observable } from "rxjs";
import { ProposalGroup } from "../../../common/models/proposal-group";
import { delayWhen, scan, shareReplay, switchMap, tap, withLatestFrom } from "rxjs/operators";
import { ActivatedRoute } from "@angular/router";
import { TechnicalCommercialProposalService } from "../../services/technical-commercial-proposal.service";
import { Uuid } from "../../../../cart/models/uuid";
import { RequestState } from "../../states/request.state";
import { RequestActions } from "../../actions/request.actions";
import { UxgBreadcrumbsService } from "uxg";
import { Select, Store } from "@ngxs/store";
import { Request } from "../../../common/models/request";
import { FormBuilder } from "@angular/forms";
import { TechnicalCommercialProposalGroupFilter } from "../../../common/models/technical-commercial-proposal-group-filter";
import moment from "moment";

@Component({
  selector: 'app-technical-commercial-proposal-group-view',
  templateUrl: './technical-commercial-proposal-group-view.component.html'
})
export class TechnicalCommercialProposalGroupViewComponent {
  @Select(RequestState.request) request$: Observable<Request>;
  requestId: Uuid;
  readonly newGroup$ = new BehaviorSubject<ProposalGroup>(null);
  readonly filter$ = new BehaviorSubject<TechnicalCommercialProposalGroupFilter>({});
  readonly form = this.fb.group({ requestPositionName: null, createdDateFrom: null, createdDateTo: null });

  readonly tcpGroups$: Observable<ProposalGroup[]> = this.route.params.pipe(
    tap(({ id }) => this.requestId = id),
    delayWhen(({ id }) => this.store.dispatch(new RequestActions.Fetch(id))),
    withLatestFrom(this.request$),
    tap(([p, { id, number }]) => this.bc.breadcrumbs = [
      { label: "Заявки", link: "/requests/customer" },
      { label: `Заявка №${number}`, link: `/requests/customer/${id}` },
      { label: 'Согласование ТКП', link: `/requests/customer/${this.requestId}/technical-commercial-proposals`},
    ]),
    switchMap(() => this.filter$),
    switchMap((filter) => this.service.groupList(this.requestId, filter)),
    switchMap(groups => this.newGroup$.pipe(scan((acc, group) => {
      if (group) {
        const i = acc.findIndex(({id}) => group?.id === id);
        i !== -1 ? acc[i] = group : acc.push(group);
      }

      return acc;
    }, groups))),
    shareReplay(1)
  );

  constructor(
    private bc: UxgBreadcrumbsService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private store: Store,
    public service: TechnicalCommercialProposalService,
  ) {}

  filter(filter: TechnicalCommercialProposalGroupFilter) {
    this.filter$.next({
      ...filter,
      createdDateFrom: filter.createdDateFrom ? moment(filter.createdDateFrom, 'DD.MM.YYYY').format('YYYY-MM-DD') : null,
      createdDateTo: filter.createdDateTo ? moment(filter.createdDateTo, 'DD.MM.YYYY').format('YYYY-MM-DD') : null
    });
  }
}
