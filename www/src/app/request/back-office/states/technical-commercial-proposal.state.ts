import { TechnicalCommercialProposal } from "../../common/models/technical-commercial-proposal";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { TechnicalCommercialProposalService } from "../services/technical-commercial-proposal.service";
import { tap } from "rxjs/operators";
import { TechnicalCommercialProposals } from "../actions/technical-commercial-proposal.actions";
import { insertItem, patch, updateItem } from "@ngxs/store/operators";

@State<TechnicalCommercialProposal[]>({
  name: 'TechnicalCommercialProposals',
  defaults: null
})
export class TechnicalCommercialProposalState {
  constructor(private technicalCommercialProposalService: TechnicalCommercialProposalService) {}

  @Selector()
  static getList(technicalCommercialProposals: TechnicalCommercialProposal[]) {
    return technicalCommercialProposals;
  }

  @Action(TechnicalCommercialProposals.Fetch)
  fetch(ctx: StateContext<TechnicalCommercialProposal[]>, {requestId}: TechnicalCommercialProposals.Fetch) {
    if (ctx.getState()) { return; }
    return this.technicalCommercialProposalService.list(requestId)
      .pipe(tap(technicalCommercialProposals => ctx.setState(technicalCommercialProposals)));
  }

  @Action(TechnicalCommercialProposals.Create)
  create(
    ctx: StateContext<TechnicalCommercialProposal[]>,
    { requestId, payload }: TechnicalCommercialProposals.Create) {
    return this.technicalCommercialProposalService.create(requestId, payload)
      .pipe(tap(technicalCommercialProposal => ctx.setState(insertItem(technicalCommercialProposal))));
  }

  @Action(TechnicalCommercialProposals.Update)
  update(
    ctx: StateContext<TechnicalCommercialProposal[]>,
    { requestId, payload }: TechnicalCommercialProposals.Update) {
    return this.technicalCommercialProposalService.update(requestId, payload)
      .pipe(tap(technicalCommercialProposal => ctx.setState(
        updateItem(tcp => tcp.id === payload.id, patch(payload)))));
  }
}
