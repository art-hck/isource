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
  editedGroup: TechnicalCommercialProposalGroup;
  readonly newGroup$ = new BehaviorSubject<TechnicalCommercialProposalGroup>(null);

  readonly tcpGroups$: Observable<TechnicalCommercialProposalGroup[]> = this.route.params.pipe(
    tap(({ id }) => this.requestId = id),
    switchMap(({ id }) => this.service.groupList(this.requestId)),
    switchMap(groups => this.newGroup$.pipe(scan((acc, group) => {
      if (group) {
        const i = acc.findIndex(({id}) => group?.id === id);
        i !== -1 ? acc[i] = group : acc.push(group);
      }

      return acc;
    }, groups))),
  );

  constructor(
    private route: ActivatedRoute,
    public service: TechnicalCommercialProposalService
  ) {}
}
