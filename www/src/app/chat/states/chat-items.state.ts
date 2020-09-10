import { Action, createSelector, Selector, State, StateContext } from "@ngxs/store";
import { Injectable } from "@angular/core";
import { StateStatus } from "../../request/common/models/state-status";
import { append, iif, patch, updateItem } from "@ngxs/store/operators";
import { flatMap, take, tap } from "rxjs/operators";
import { ChatItems } from "../actions/chat-items.actions";
import { ContextsService } from "../services/contexts.service";
import { ChatItem } from "../models/chat-item";
import { RequestListItem } from "../../request/common/models/requests-list/requests-list-item";
import { Uuid } from "../../cart/models/uuid";
import { ChatMessages } from "../actions/chat-messages.actions";
import { decrement } from "../../shared/state-operators/decrement";
import { increment } from "../../shared/state-operators/increment";
import FetchItems = ChatItems.FetchItems;
import FetchRequests = ChatItems.FetchRequests;
import FilterRequests = ChatItems.FilterRequests;
import AppendContexts = ChatItems.AppendContexts;
import UpdateRequest = ChatItems.UpdateRequest;
import IncrementUnread = ChatItems.IncrementUnread;
import MarkAsRead = ChatMessages.MarkAsRead;
import AppendItems = ChatItems.AppendItems;

export interface MessagesStateModel {
  items: ChatItem[];
  status: StateStatus;
}

type Model = MessagesStateModel;
type Ctx = StateContext<Model>;

@State<Model>({
  name: 'ChatItems',
  defaults: { items: [], status: "pristine" }
})
@Injectable()
export class ChatItemsState {

  constructor(private contextService: ContextsService) {}

  @Selector() static status({ status }: Model) { return status; }
  @Selector() static items({ items }: Model) { return items.filter(({ request }) => !!request); }

  static item = (id: RequestListItem["id"]) => createSelector([ChatItemsState.items],
    (items: ChatItem[]) => items.find(({ request }) => request.id === id)
  )

  static conversationId = (id: RequestListItem["id"]) => createSelector(
    [ChatItemsState.item(id)], ({ request }: ChatItem) => request?.conversation?.externalId
  )

  @Action([FetchItems, AppendItems])
  fetchItems({ setState, getState, dispatch }: Ctx, a: FetchItems) {
    const { role, startFrom, pageSize, filters, sort } = a;
    if (a instanceof FetchItems) {
      setState(patch({ items: [], status: "fetching" as StateStatus } as Model));
    }

    return this.contextService.get({ limit: pageSize, offset: startFrom }).pipe(
      take(1),
      flatMap(contexts => dispatch([
        // Записываем контексты в стейт
        new AppendContexts(contexts),
        // Получаем заявки
        new FetchRequests(role, startFrom, pageSize, { ...filters, chatContexts: contexts.map(({ id }) => id) }, sort)
      ])),
      tap(() => setState(patch({ status: "received" as StateStatus }))),
    );
  }

  @Action([FetchRequests, FilterRequests, UpdateRequest])
  fetchRequests({ setState, getState, dispatch }: Ctx, a: FetchRequests & FilterRequests) {
    const { role, startFrom, pageSize, filters, sort } = a;
    if (!(a instanceof FetchRequests)) {
      setState(patch({ status: "updating" as StateStatus }));
    }

    return this.contextService.getRequests(role, startFrom, pageSize, filters, sort).pipe(
      tap(({ entities: requests }) => {
        if (a instanceof FilterRequests) {
          // Очищаем items от старых заявок
          setState(patch({ items: getState().items.map(item => ({ ...item, request: null } as ChatItem)) }));
        }

        requests.filter(({ context }) => !!context).forEach((request) => setState(patch({
          items: updateItem(({ context }) => context && context?.id === request.context?.externalId, patch({ request }))
        })));

        setState(patch({
          items: append<ChatItem>(requests.filter(({ context }) => !context).map(request => ({ request })))
        }));

        if (!(a instanceof FetchRequests)) {
          setState(patch({ status: "received" as StateStatus }));
        }
      })
    );
  }

  @Action(AppendContexts)
  appendContexts({ setState }: Ctx, { contexts }: AppendContexts) {
    return contexts.forEach(context => {
      const requestId: Uuid = JSON.parse(context.items[0].data).contextId;
      const findFn = (item: ChatItem) => item.request?.id === requestId;
      return setState(patch({
        items: iif(items => items.some(findFn),
          updateItem(item => !item.context && findFn(item), patch({ context })), // обновляем только если контекста еще нет!
          append([{ context }])
        )
      }));
    });
  }

  @Action(IncrementUnread)
  incrementUnread({ setState, getState }: Ctx, { context }: IncrementUnread) {
    const findFn = (item: ChatItem) => item.context?.id === context.id;
    setState(patch({
      items: updateItem(findFn, patch({ context: patch({ unreadCount: increment(1) }) }))
    }));
  }

  @Action(MarkAsRead)
  markAsRead({ setState }: Ctx, { requestId, updated }: MarkAsRead) {
    return setState(patch({
      items: updateItem(({ request }) => request?.id === requestId, patch({
        context: patch({ unreadCount: decrement(updated) })
      }))
    }));
  }
}
