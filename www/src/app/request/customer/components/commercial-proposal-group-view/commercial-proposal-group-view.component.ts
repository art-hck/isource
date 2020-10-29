import { Component } from '@angular/core';
import { BehaviorSubject, Observable } from "rxjs";
import { ProposalGroup } from "../../../common/models/proposal-group";
import { delayWhen, scan, shareReplay, switchMap, tap, withLatestFrom } from "rxjs/operators";
import { ActivatedRoute } from "@angular/router";
import { CommercialProposalsService } from "../../services/commercial-proposals.service";
import { Uuid } from "../../../../cart/models/uuid";
import { RequestState } from "../../states/request.state";
import { RequestActions } from "../../actions/request.actions";
import { UxgBreadcrumbsService } from "uxg";
import { Select, Store } from "@ngxs/store";
import { Request } from "../../../common/models/request";
import { FormBuilder } from "@angular/forms";
import { CommercialProposalGroupFilter } from "../../../common/models/commercial-proposal-group-filter";
import moment from "moment";

@Component({
  selector: 'app-commercial-proposal-group-view',
  templateUrl: './commercial-proposal-group-view.component.html'
})
export class CommercialProposalGroupViewComponent {
  @Select(RequestState.request) request$: Observable<Request>;
  requestId: Uuid;
  readonly newGroup$ = new BehaviorSubject<ProposalGroup>(null);
  readonly filter$ = new BehaviorSubject<CommercialProposalGroupFilter>({});
  readonly form = this.fb.group({ requestPositionName: null, createdDateFrom: null, createdDateTo: null });

  readonly tcpGroups$: Observable<ProposalGroup[]> = this.route.params.pipe(
    tap(({ id }) => this.requestId = id),
    delayWhen(({ id }) => this.store.dispatch(new RequestActions.Fetch(id))),
    withLatestFrom(this.request$),
    tap(([p, { id, number }]) => this.bc.breadcrumbs = [
      { label: "Заявки", link: "/requests/customer" },
      { label: `Заявка №${number}`, link: `/requests/customer/${id}` },
      { label: 'Согласование КП', link: `/requests/customer/${this.requestId}/commercial-proposals`},
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
    public service: CommercialProposalsService,
  ) {}

  filter(filter: CommercialProposalGroupFilter) {
    this.filter$.next({
      ...filter,
      createdDateFrom: filter.createdDateFrom ? moment(filter.createdDateFrom, 'DD.MM.YYYY').format('YYYY-MM-DD') : null,
      createdDateTo: filter.createdDateTo ? moment(filter.createdDateTo, 'DD.MM.YYYY').format('YYYY-MM-DD') : null
    });
  }
}
