import { StateStatus } from "../../request/common/models/state-status";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { RequestsList } from "../../request/common/models/requests-list/requests-list";
import { Injectable } from "@angular/core";
import { MessagesService } from "../services/messages.service";
import { RequestPositionList } from "../../request/common/models/request-position-list";
import { patch, updateItem } from "@ngxs/store/operators";
import { flatMap, map, mergeMap, switchMap, take, tap } from "rxjs/operators";
import { Page } from "../../core/models/page";
import { Messages } from "../actions/messages.actions";
import Fetch = Messages.Fetch;
import FetchPositions = Messages.FetchPositions;
import FetchCounters = Messages.FetchCounters;
import { ContextsService } from "../services/contexts.service";
import { TechnicalCommercialProposal } from "../../request/common/models/technical-commercial-proposal";
import { of } from "rxjs";
import Update = Messages.Update;

export interface MessagesStateModel {
  requests: Page<RequestsList>;
  status: StateStatus;
  requestsItems: RequestPositionList[];
}

type Model = MessagesStateModel;
type Context = StateContext<Model>;

@State<Model>({
  name: 'Messages',
  defaults: { requests: null, requestsItems: null, status: "pristine" }
})
@Injectable()
export class MessagesState {
  // cache: { [requestId in Uuid]: TechnicalCommercialProposal[] } = {};

  constructor(private rest: MessagesService,
              private contextsService: ContextsService) {
  }

  @Selector()
  static requests({ requests }: Model) { return requests; }

  @Selector()
  static requestsItems({ requestsItems }: Model) { return requestsItems; }

  @Selector()
  static status({ status }: Model) { return status; }

  @Action(Fetch)
  fetch(ctx: Context, { role, startFrom, pageSize, filters, sort }: Fetch) {

    ctx.setState(patch({ requests: null, status: "fetching" as StateStatus }));
    return this.rest.getRequests(role, startFrom, pageSize, filters, sort).pipe(
      tap(requests => ctx.setState(patch({ requests }))),
      tap(() => new FetchCounters()),
      tap(() => ctx.setState(patch({ status: "received" as StateStatus }))),
    );
  }

  @Action(FetchPositions)
  fetchPositions({ setState }: Context, { requestId, role }: FetchPositions) {
    setState(patch({ requestsItems: null }));
    return this.rest.getRequestItems(requestId, role).pipe(
      tap(requestsItems => setState(patch({ requestsItems }))),
      tap(() => setState(patch({ status: "received" as StateStatus }))),
    );
  }

  @Action(FetchCounters)
  fetchCounters({ getState, setState }: Context) {
    const contextIds = getState().requests.entities.filter(({ request }) => request?.context?.externalId).map(({ request }) => request?.context?.externalId);
    return this.contextsService.get(contextIds).pipe(
      tap(contexts => {
        (contexts ?? []).forEach(context => {
          setState(patch({
            requests: patch({
                entities: updateItem(request => request.request.context?.externalId === context.id,
                  patch({
                    request: patch({ context: patch({ unreadCount: context.unreadCount }) })
                  }))
              }
            ),
            requestsItems: updateItem(conversation => conversation.conversation.externalId === context.id,
                patch({
                  conversation: patch({unreadCount: context.unreadCount})
                }))
          }));
        });
      }));
  }

  @Action(Update)
  update(ctx: Context, {}: Update) {
    // ctx.setState(patch({ status: "updating" as StateStatus }));
    // return this.rest.update(payload).pipe(
    //   tap(proposal => ctx.setState(patch({
    //     proposals: updateItem<TechnicalCommercialProposal>(_proposal => _proposal.id === proposal.id, patch(proposal)),
    //     status: "received" as StateStatus
    //   }))),
    //   mergeMap(proposal => {
    //     if (publish) {
    //       return ctx.dispatch(new Publish(proposal));
    //     } else {
    //       return of(proposal);
    //     }
    //   }),
    // );
  }
}
