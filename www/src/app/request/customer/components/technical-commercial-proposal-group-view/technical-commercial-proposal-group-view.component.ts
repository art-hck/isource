import { Component } from '@angular/core';
import { BehaviorSubject, Observable } from "rxjs";
import { TechnicalCommercialProposalGroup } from "../../../common/models/technical-commercial-proposal-group";
import { scan, switchMap, tap } from "rxjs/operators";
import { ActivatedRoute } from "@angular/router";
import { TechnicalCommercialProposalService } from "../../services/technical-commercial-proposal.service";
import { Uuid } from "../../../../cart/models/uuid";

@Component({
  selector: 'app-technical-commercial-proposal-group-view',
  templateUrl: './technical-commercial-proposal-group-view.component.html'
})
export class TechnicalCommercialProposalGroupViewComponent {
  requestId: Uuid;
  readonly newGroup$ = new BehaviorSubject<TechnicalCommercialProposalGroup>(null);

  readonly tcpGroups$: Observable<TechnicalCommercialProposalGroup[]> = this.route.params.pipe(
    tap(({ id }) => this.requestId = id),
    switchMap(({ id }) => this.service.groupList(this.requestId)),
    switchMap(groups => this.newGroup$.pipe(scan((acc, group) => group ? [...acc, group] : acc, groups))),
  );

  constructor(
    private route: ActivatedRoute,
    public service: TechnicalCommercialProposalService
  ) {}
}
