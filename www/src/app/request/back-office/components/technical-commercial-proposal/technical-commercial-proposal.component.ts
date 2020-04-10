import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TechnicalCommercialProposal } from "../../../common/models/technical-commercial-proposal";
import { getCurrencySymbol } from "@angular/common";
import { Request } from "../../../common/models/request";
import { Select, Store } from "@ngxs/store";
import { TechnicalCommercialProposals } from "../../actions/technical-commercial-proposal.actions";
import { TechnicalCommercialProposalState } from "../../states/technical-commercial-proposal.state";
import { Observable } from "rxjs";
import { StateStatus } from "../../../common/models/state-status";
import Publish = TechnicalCommercialProposals.Publish;

@Component({
  selector: 'app-request-technical-commercial-proposal',
  templateUrl: './technical-commercial-proposal.component.html',
  styleUrls: ['technical-commercial-proposal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TechnicalCommercialProposalComponent {
  @Input() request: Request;
  @Input() technicalCommercialProposal: TechnicalCommercialProposal;
  @Select(TechnicalCommercialProposalState.status) status$: Observable<StateStatus>;
  state: "view" | "edit" = "view";
  folded = false;
  getCurrencySymbol = getCurrencySymbol;

  constructor(private store: Store) {}

  publish() {
    return this.store.dispatch(new Publish(this.technicalCommercialProposal));
  }
}
