import { StateStatus } from "../../request/common/models/state-status";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { RequestsList } from "../../request/common/models/requests-list/requests-list";
import { Injectable } from "@angular/core";
import { MessagesService } from "../services/messages.service";
import { RequestPositionList } from "../../request/common/models/request-position-list";
import { append, patch, updateItem } from "@ngxs/store/operators";
import { switchMap, tap } from "rxjs/operators";
import { Page } from "../../core/models/page";
import { Messages } from "../actions/messages.actions";
import { ContextsService } from "../services/contexts.service";
import { ConversationsService } from "../services/conversations.service";
import { Message } from "../models/message";
import { of } from "rxjs";
import Fetch = Messages.Fetch;
import FetchPositions = Messages.FetchPositions;
import Update = Messages.Update;
import CreateConversation = Messages.CreateConversation;
import Send = Messages.Send;
import Get = Messages.Get;
import FetchConversationCounters = Messages.FetchConversationCounters;
import FetchRequestCounters = Messages.FetchRequestCounters;
import OnNew = Messages.OnNew;


export interface MessagesStateModel {
  requests: Page<RequestsList>;
  status: StateStatus;
  requestsItems: RequestPositionList[];
  messages: Message[];
  externalId: number;
  newMessage: Message;
}

type Model = MessagesStateModel;
type Context = StateContext<Model>;

@State<Model>({
  name: 'Messages',
  defaults: { requests: null, requestsItems: null, messages: null, externalId: null, newMessage: null, status: "pristine" }
})
@Injectable()
export class MessagesState {
  // cache: { [requestId in Uuid]: TechnicalCommercialProposal[] } = {};

  constructor(private rest: MessagesService,
              private contextsService: ContextsService,
              private conversationsService: ConversationsService) {
  }

  @Selector()
  static requests({ requests }: Model) { return requests; }

  @Selector()
  static requestsItems({ requestsItems }: Model) { return requestsItems; }

  @Selector()
  static messages({ messages }: Model) { return messages; }

  @Selector()
  static externalId({ externalId }: Model) { return externalId; }

  @Selector()
  static status({ status }: Model) { return status; }

  @Selector()
  static newMessage({ newMessage }: Model) { return newMessage; }


  @Action(Fetch)
  fetch({ setState, dispatch }: Context, { role, startFrom, pageSize, filters, sort }: Fetch) {

    setState(patch({ requests: null, status: "fetching" as StateStatus }));
    return this.rest.getRequests(role, startFrom, pageSize, filters, sort).pipe(
      tap(requests => setState(patch({ requests }))),
      tap(() => setState(patch({ status: "received" as StateStatus }))),
    );
  }

  @Action(FetchPositions)
  fetchPositions({ setState, dispatch }: Context, { requestId, role }: FetchPositions) {
    setState(patch({ requestsItems: null }));
    return this.rest.getRequestItems(requestId, role).pipe(
      tap(requestsItems => setState(patch({ requestsItems }))),
      tap(() => setState(patch({ status: "received" as StateStatus }))),
    );
  }

  @Action(FetchRequestCounters)
  fetchRequestCounters({ getState, setState }: Context) {
    const contextIds = getState().requests.entities.filter(({ request }) => request?.context?.externalId).map(({ request }) => request?.context?.externalId);
    if (!contextIds.length) {
      return of([]);
    }
    return this.contextsService.get(contextIds).pipe(
      tap(contexts => {
          (contexts ?? []).forEach(context => {
            setState(patch({
                requests: patch({
                    entities: updateItem(request => request.request.context?.externalId === context.id,
                      patch({
                        request: patch({ context: patch({ unreadCount: context.unreadCount }) }),
                      }))
                  }
                ),
              })
            );
          });
        }
      )
    );
  }

  @Action(FetchConversationCounters) fetchConversationCounters({ getState, setState }: Context) {
    const contextIds = getState().requestsItems.filter(({ conversation }) => conversation?.externalId).map((conversation) => conversation.conversation.externalId);
    if (!contextIds.length) {
      return of([]);
    }
    return this.conversationsService.get(contextIds).pipe(
      tap(conversations => {
          (conversations ?? []).forEach(conversation => {
            setState(patch({
              requestsItems: updateItem(c => c?.conversation?.externalId === conversation.id,
                patch({
                  positions: updateItem(position => position?.conversation?.externalId === conversation.id,
                    patch({ conversation: patch({ unreadCount: conversation.unreadCount }) }))
                }))
            }));
          });
        }
      ));
  }

  @Action(Update) update({ setState, dispatch }: Context, { role, startFrom, pageSize, filters, sort }: Update) {
    setState(patch({ status: "updating" as StateStatus }));
    return this.rest.getRequests(role, startFrom, pageSize, filters, sort).pipe(
      tap(requests => setState(patch({ requests }))),
      switchMap(() => dispatch(new FetchRequestCounters())),
      tap(() => setState(patch({ status: "received" as StateStatus }))),
    );
  }

  @Action(CreateConversation) create({ setState, dispatch }: Context, { contextType, contextId }: CreateConversation) {
    setState(patch({ status: "fetching" as StateStatus }));
    return this.conversationsService.apiCreate(contextType, contextId).pipe(
      tap(({ externalId }) => setState(patch({ externalId }))),
      tap(() => setState(patch({ status: "received" as StateStatus })))
    );
  }

  @Action(Send) send(ctx: Context, { text, conversationId, attachmentsId }: Send) {
    ctx.setState(patch({ status: "fetching" as StateStatus }));
    return this.rest.send(text, conversationId, attachmentsId).pipe(
      tap(() => ctx.setState(patch({ status: "received" as StateStatus }))),
    );
  }

  @Action(Get) get(ctx: Context, { conversationId }: Get) {
    ctx.setState(patch({ status: "fetching" as StateStatus }));
    return this.rest.get(conversationId).pipe(
      tap(messages => ctx.setState(patch({ messages }))),
      tap(() => ctx.setState(patch({ status: "received" as StateStatus })))
    );
  }

  @Action(OnNew) onNew(ctx: Context, { message }: OnNew) {
    return ctx.setState(patch({ messages: append([message]) }));
  }
}
