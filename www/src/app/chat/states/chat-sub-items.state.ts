import { Action, createSelector, Selector, State, StateContext } from "@ngxs/store";
import { Injectable } from "@angular/core";
import { StateStatus } from "../../request/common/models/state-status";
import { append, iif, insertItem, patch, updateItem } from "@ngxs/store/operators";
import { flatMap, map, take, tap } from "rxjs/operators";
import { ContextsService } from "../services/contexts.service";
import { ChatSubItem } from "../models/chat-item";
import { ConversationsService } from "../services/conversations.service";
import { RequestPositionList } from "../../request/common/models/request-position-list";
import { ChatSubItems } from "../actions/chat-sub-items.actions";
import { ChatMessages } from "../actions/chat-messages.actions";
import { decrement } from "../../shared/state-operators/decrement";
import Fetch = ChatSubItems.Fetch;
import FetchPositions = ChatSubItems.FetchPositions;
import AppendConversation = ChatSubItems.AppendConversation;
import IncrementUnread = ChatSubItems.IncrementUnread;
import MarkAsRead = ChatMessages.MarkAsRead;
import { increment } from "../../shared/state-operators/increment";

export interface MessagesStateModel {
  subItems: ChatSubItem[];
  status: StateStatus;
}

type Model = MessagesStateModel;
type Ctx = StateContext<Model>;

@State<Model>({
  name: 'ChatSubItems',
  defaults: { subItems: [], status: "pristine" }
})
@Injectable()
export class ChatSubItemsState {
  constructor(
    private service: ContextsService,
    private conversationsService: ConversationsService
  ) {}

  @Selector() static status({ status }: Model) { return status; }
  @Selector() static subItems({ subItems }: Model) { return subItems.filter(({ position }) => !!position); }

  static subItem = (id: RequestPositionList["id"]) => createSelector([ChatSubItemsState.subItems],
    (subItems: ChatSubItem[]) => subItems.find(({ position }) => position.id === id)
  )

  static position = (id: RequestPositionList["id"]) => createSelector([ChatSubItemsState.subItem(id)],
    (subItem: ChatSubItem) => subItem?.position
  )

  static conversationId = (id: RequestPositionList["id"]) => createSelector(
    [ChatSubItemsState.subItem(id)], (subItem: ChatSubItem) => subItem.position.conversation.externalId
  )

  @Action(Fetch)
  fetchSubItems({ setState, dispatch }: Ctx, { role, request }: Fetch) {
    setState(patch({ subItems: [] } as Model));
    // Получаем конверсейшены только по текущему контексту

    return this.conversationsService.get(/*request.context.externalId*/).pipe(
      take(1),
      map(conversations => conversations.map(conversation => ({ conversation }))),
      tap((subItems: ChatSubItem[]) => setState(patch({ subItems  }))),
      flatMap(() => dispatch(new FetchPositions(role, request))));

    // if (request.context?.externalId) {
    //   return this.service.get(request.context?.externalId).pipe(
    //     take(1),
    //     map(([{ conversations }]) => conversations.map(conversation => ({ conversation }))),
    //     tap((subItems: ChatSubItem[]) => setState(patch({ subItems  }))),
    //     flatMap(() => dispatch(new FetchPositions(role, request)))
    //   );
    // } else {
    //   dispatch(new FetchPositions(role, request));
    // }
  }

  @Action(FetchPositions)
  fetchPositions({ setState }: Ctx, { request, role }: FetchPositions) {
    return this.service.getRequestItems(request.id, role).pipe(tap(positions => {
      positions.forEach(position => {
        setState(patch({
          subItems: iif(
            subItems => !!position.conversation || subItems.some(item => item.position?.id === position.id),
            updateItem(
              item => (position.conversation && item.conversation?.id === position.conversation.externalId) || item.position?.id === position.id,
              patch({ position })
            ),
            append([{ position } as ChatSubItem])
          )
        }));
      });
    }));
  }

  @Action(AppendConversation)
  appendConversation({setState}: Ctx, {conversation}: AppendConversation) {
    const findFn = (item: ChatSubItem) => item.position?.conversation?.externalId === conversation.id;
    return setState(patch({
      subItems: iif(
        subItems => subItems.some(findFn),
        updateItem(findFn, patch({ conversation })),
        insertItem({ conversation })
      )
    }));
  }

  @Action(IncrementUnread)
  incrementUnread({ setState, getState }: Ctx, { conversation }: IncrementUnread) {
    const findFn = (item: ChatSubItem) => item.conversation?.id === conversation.id;
    // const unreadCount = getState().subItems.find(findFn)?.conversation.unreadCount + 1;
    setState(patch({
      subItems: updateItem(findFn, patch({ conversation: patch({ unreadCount: increment(1) }) }))
    }));
  }

  @Action(MarkAsRead)
  markAsRead({ setState }: Ctx, { conversationId, updated }: MarkAsRead) {
    const findFn = ({conversation}: ChatSubItem) => conversation?.id === conversationId;

    return setState(patch({
      subItems: updateItem(findFn, patch({
        conversation: patch({ unreadCount: decrement(updated) })
      }))
    }));
  }
}
