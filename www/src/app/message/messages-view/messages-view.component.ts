import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { fromEvent, merge, Observable, of, Subject } from "rxjs";
import { Page } from "../../core/models/page";
import { RequestsList } from "../../request/common/models/requests-list/requests-list";
import { RequestPositionList } from "../../request/common/models/request-position-list";
import { RequestListItem } from "../../request/common/models/requests-list/requests-list-item";
import { MessageContextTypes } from "../message-context-types";
import { RequestGroup } from "../../request/common/models/request-group";
import { RequestPosition } from "../../request/common/models/request-position";
import { Uuid } from "../../cart/models/uuid";
import {
  debounceTime,
  filter,
  flatMap,
  map,
  shareReplay,
  switchMap,
  take,
  takeUntil,
  tap,
  withLatestFrom
} from "rxjs/operators";
import { UserInfoService } from "../../user/service/user-info.service";
import { RequestItemsStore } from '../data/request-items-store';
import { ActivatedRoute, Router } from "@angular/router";
import { MessagesService } from "../services/messages.service";
import { Conversation } from "../models/conversation";
import { ConversationsService } from "../services/conversations.service";
import { Attachment } from "../models/attachment";
import { Request } from "../../request/common/models/request";
import { ContextsService } from "../services/contexts.service";
import { Actions, Select, Store } from "@ngxs/store";
import { MessagesState } from "../states/messages.state";
import { Messages } from "../actions/messages.actions";
import Fetch = Messages.Fetch;
import FetchPositions = Messages.FetchPositions;
import Update = Messages.Update;
import CreateConversation = Messages.CreateConversation;
import Send = Messages.Send;
import Get = Messages.Get;
import FetchRequestCounters = Messages.FetchRequestCounters;
import FetchConversationCounters = Messages.FetchConversationCounters;

@Component({
  selector: 'app-message-messages-view',
  templateUrl: './messages-view.component.html',
  styleUrls: ['./messages-view.component.scss']
})
export class MessagesViewComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('requestsSearchField') requestsSearchField: ElementRef;
  @Select(MessagesState.requests) requests$: Observable<Page<RequestsList>>;
  @Select(MessagesState.requestsItems) requestsItems$: Observable<RequestPositionList[]>;
  @Select(MessagesState.externalId) externalId$: Observable<number>;

  requestId: Uuid;
  positionId: Uuid;

  requestEntities: RequestsList[];

  selectedRequest: RequestListItem;
  selectedRequestsItem: RequestPositionList;

  contextId: RequestPositionList["id"];
  conversationId: Conversation["id"];
  contextType: MessageContextTypes;

  requestFilterInputValue = '';
  requestItemFilterInputValue = '';

  requestListSearchLoader = false;
  pageSize = 25;

  protected requestsItems: RequestItemsStore;
  readonly destroy$ = new Subject();

  constructor(
    private messageService: MessagesService,
    private conversationsService: ConversationsService,
    private contextsService: ContextsService,
    private user: UserInfoService,
    private route: ActivatedRoute,
    private router: Router,
    private cd: ChangeDetectorRef,
    private actions: Actions,
    public store: Store
  ) {
  }

  protected static getContextType(item: (RequestPositionList | RequestGroup | RequestPosition)) {
    if (item instanceof RequestPosition) {
      return MessageContextTypes.REQUEST_POSITION;
    } else if (item instanceof RequestGroup) {
      return MessageContextTypes.REQUEST_GROUP;
    }
  }

  protected static getContextId(item: (RequestPositionList | RequestGroup | RequestPosition)) {
    // Костыль, т.к. у нас есть еще и черновики, которые приходят со своим id
    return item instanceof RequestPosition && !!item.sourceRequestPositionId ?
      item.sourceRequestPositionId :
      item.id;
  }

  ngOnInit() {
    this.getRouteData();

    this.store.dispatch(new Fetch(this.user.getUserRole(), 0, this.pageSize, [], null)).pipe(
      tap(() => this.store.dispatch(new FetchRequestCounters())))
      // tap(() =>  this.jumpToRequestOrPosition()))
      .subscribe();

    merge(this.messageService.onNew(), this.messageService.onMarkSeen()).pipe(
      debounceTime(100),
      takeUntil(this.destroy$)
    ).subscribe(() => this.store.dispatch(new Update(this.user.getUserRole(), 0, this.pageSize, [], null)));

    // this.conversationsService.onNew().pipe(takeUntil(this.destroy$)).subscribe((() => {
    //   this.store.dispatch(new Update(this.user.getUserRole(), 0, this.pageSize, [], null));
    // }));

    this.conversationsService.onNew().pipe(takeUntil(this.destroy$)).subscribe(conversation => {
      const requestId: Request['id'] = JSON.parse(conversation.context.items[0].data).contextId;

      this.store.dispatch(new Update(this.user.getUserRole(), 0, this.pageSize, [], null))
        .pipe(takeUntil(this.destroy$))
        .subscribe(({ entities }) => {
          // приходит всегда одна заявка, которую ищем по id
          const request = entities[0].request;

          // проходим по текущим заявкам и обновляем ту, в которой пришло сообщение
          this.requests$ = this.requests$.pipe(
            map(requests => {
              const requestIndex = requests.entities.findIndex(({ request: { id } }) => id === request.id);
              if (requestIndex !== -1) {
                requests.entities[requestIndex].request = request;
                // если сообщение пришло в текущую заявку
                if (this.selectedRequest.id === requests.entities[requestIndex].request.id) {
                  // то обновим и объект текущей позиции
                  this.selectedRequest = requests.entities[requestIndex].request;

                  // если не выделена ни одина позиция, то мы стоим на "Обсуждение заказа"
                  // а значит нужно обновить сообщения для него
                  if (!this.selectedRequestsItem && request.conversation) {
                    this.setConversation(request.conversation);
                  }
                }
              }
              return requests;
            }),
            shareReplay(1)
          );
        });
      if (this.selectedRequest.id === requestId) {
        this.store.dispatch(new Update(this.user.getUserRole(), 0, this.pageSize, [], null)).pipe(
          tap((data) => data.find(item => item.id === this.contextId && this.selectedRequestsItem)?.conversation ?
            this.setConversation(data.find(item => item.id === this.contextId && this.selectedRequestsItem)?.conversation) : null)
        );
      }
    });
  }

  ngAfterViewInit() {
    fromEvent(this.requestsSearchField.nativeElement, 'input').pipe(
      // Пропускаем изменения, которые происходят чаще 500ms для разгрузки бэкенда
      debounceTime(500),
      takeUntil(this.destroy$)
    ).subscribe(
      (event: Event) => this.onRequestFilterChange(event)
    );
  }

  getRouteData() {
    if (this.route.snapshot.children[0]) {
      this.requestId = this.route.snapshot.children[0].params['request-id'];

      this.positionId = this.route.snapshot.children[0].children[0] ?
        this.route.snapshot.children[0].children[0].params['position-id'] :
        null;
    }
  }

  /**
   * Преобразует RequestPositionList в одноуровневый массив позиций без групп
   */
  getRequestPositionsFlat(requestPositionsList: RequestPositionList[], widthGroups = false): RequestPosition[] {
    return requestPositionsList.reduce(function flatPositionList(arr, curr: RequestPositionList) {
      if (curr instanceof RequestGroup) {
        return widthGroups ? [...arr, curr, ...flatPositionList(curr.positions, null)] : [...arr, ...flatPositionList(curr.positions, null)];
      } else {
        return [...arr, curr].filter(Boolean);
      }
    }, []);
  }

  jumpToRequestOrPosition(): void {
    // let requestEntities = [];
    let requestToSelect = [];

    if (this.requestId) {
      // Выбор заявки в списке
      this.requests$.pipe(takeUntil(this.destroy$)).subscribe((requests) => {
        // requestEntities = requests.entities;
        requestToSelect = this.requestEntities.filter(
          ({ request }) => {
            return request.id === this.requestId;
          });

        if (!requestToSelect || requestToSelect.length === 0) {
          this.appendRequests(this.requestEntities.length).subscribe((data) => {
            this.requests$ = of(data);
            this.jumpToRequestOrPosition();
          });
        } else {
          // Кликаем по нужной заявке
          this.onRequestClick(requestToSelect[0].request);

          // Если передан id позиции, выделяем и его
          if (this.positionId) {
            // Выбор позиции в списке
            this.requestsItems$.pipe(takeUntil(this.destroy$)).subscribe(requestItems => {
              const flatPositionsList = this.getRequestPositionsFlat(requestItems);

              const requestItemToSelect = Object.values(flatPositionsList).filter(
                requestItem => requestItem.id === this.positionId
              );

              // Кликаем по нужной позиции
              this.onRequestItemClick(requestItemToSelect[0]);
            });
          }
        }
      });
    } else {
      this.onRequestClick(this.requestEntities[0].request);
    }

    // Прокручиваем в списке заявок и позиций до выделенных элементов
    setTimeout(() => {
      const selectedItems = document.querySelectorAll('li.selected');
      selectedItems.forEach(el => el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' }));
    }, 100);
  }

  /**
   * Устанавливает идентификатор чата для отображения.
   * Требуется устанавилвать идентификатор только через эту функцию!!!
   * @param conversation
   */
  setConversation(conversation: { id: Uuid, externalId: Conversation["id"], unreadCount?: number } | null) {
    if (conversation) {
      this.store.dispatch(new Get(conversation.externalId));

      // если в диалоге есть непрочитанные сообщения, то отмечаем их все прочитанными
      if (conversation.unreadCount > 0) {
        this.messageService.markSeen({ conversationId: this.conversationId });
      }
    } else {
      this.store.dispatch(new Get(null));
    }
  }

  onRequestClick(request: RequestListItem) {
    this.selectedRequest = request;
    this.selectedRequestsItem = null;
    this.store.dispatch(new FetchPositions(this.selectedRequest.id, this.user.getUserRole())).pipe(
      tap(() => this.store.dispatch(new FetchConversationCounters()))
    ).subscribe();

    this.onRequestContextClick();
  }

  onRequestItemClick(item: (RequestPositionList | RequestGroup | RequestPosition)) {
    this.selectedRequestsItem = item;
    const requestItemType = this.getRequestEntityUrlNameByType(this.selectedRequestsItem);

    this.contextType = MessagesViewComponent.getContextType(item);
    this.contextId = MessagesViewComponent.getContextId(item);
    this.setConversation(this.selectedRequestsItem.conversation);
    this.cd.detectChanges();

    this.router.navigate(
      ['messages/request/' + this.selectedRequest.id + '/' + requestItemType + '/' + this.selectedRequestsItem.id],
      { replaceUrl: true }
    );
  }

  /**
   * Функция преобразовывает тип элемента внутри заявки в представление для ссылки
   * (.../position/... или .../group/...)
   *
   * @param entityType
   */
  getRequestEntityUrlNameByType({ entityType }: RequestPositionList | RequestGroup | RequestPosition): string {
    switch (entityType) {
      case 'POSITION':
        return 'position';
      case 'GROUP':
        return 'group';
      default:
        return 'position';
    }
  }

  onRequestContextClick(navigate = true) {
    this.selectedRequestsItem = null;

    this.contextType = MessageContextTypes.REQUEST;
    this.contextId = this.selectedRequest.id;
    // this.conversationId = this.selectedRequest.conversation?.externalId;
    this.setConversation(this.selectedRequest.conversation);

    this.router.navigate(
      ['messages/request/' + this.selectedRequest.id],
      { replaceUrl: true }
    );
  }

  getMessageHeader() {
    if (this.selectedRequestsItem) {
      return this.selectedRequestsItem.name;
    }

    if (this.selectedRequest) {
      return 'Заявка №' + this.selectedRequest.number;
    }

    return '';
  }

  getMessageHeaderExt() {
    if (this.selectedRequestsItem) {
      if (this.selectedRequestsItem instanceof RequestPosition) {
        return this.selectedRequestsItem.quantity + ' ' + this.selectedRequestsItem.measureUnit;
      } else if (this.selectedRequestsItem instanceof RequestGroup) {
        return this.selectedRequestsItem.positions.length + ' позиций';
      }
    }

    return '';
  }

  getRequestUrl(): string {
    const userRole = this.user.getUserRole();
    return `/requests/${userRole}/${this.selectedRequest.id}`;
  }

  getPositionUrl(): string {
    const userRole = this.user.getUserRole();
    return `/requests/${userRole}/${this.selectedRequest.id}/${this.selectedRequestsItem.id}`;
  }

  getRequestItemStatus(item: RequestPositionList): { name: string, label: string } {
    if (item instanceof RequestPosition) {
      return { name: item.status, label: item.statusLabel };
    } else if (item instanceof RequestGroup) {
      return null;
    }
  }

  getRequestItemClass(item: RequestPositionList) {
    return item instanceof RequestPosition ?
      'status-position-' + item.status :
      'status-position-default';
  }

  onRequestFilterChange(event: Event): void {
    this.requestListSearchLoader = true;

    const value = event.target['value'] || '';
    this.requestFilterInputValue = value.trim();
    const filter = {};
    if (this.requestFilterInputValue.length > 0) {
      filter['requestNameOrNumber'] = this.requestFilterInputValue;
    }
    this.requests$ = this.messageService
      .getRequests(this.user.getUserRole(), 0, 1000, filter, null)
      .pipe(
        tap((page: Page<RequestsList>) => {
          if (page.entities.length > 0) {
            this.onRequestClick(page.entities[0].request);
          }
          this.requestListSearchLoader = false;
        })
      );
  }

  onRequestItemFilterChange(event: Event): void {
    const value = event.target['value'] || '';
    this.requestItemFilterInputValue = value.trim();
    this.filterRequestItems(this.requestItemFilterInputValue);
  }

  protected filterRequestItems(filter: string): void {
    if (filter.length === 0) {
      this.requestsItems$ = this.requestsItems$.pipe(map(() => {
        return this.requestsItems.getRequestItems();
      }));
    } else {
      this.requestsItems$ = this.requestsItems$.pipe(map(data => {
        return this.requestsItems.getFilteredRequestItems(filter);
      }));
    }
  }

  sendMessage({ text, attachments = [] }: { text: string, attachments: Attachment[] }) {
    if (!this.conversationId) {
      this.store.dispatch(new CreateConversation(this.contextType, this.contextId, text, attachments.map(({ id }) => id)))
        .pipe(withLatestFrom(this.externalId$))
        .subscribe(([_, externalId]) => {
          this.store.dispatch(new Send(text, externalId, attachments.map(({ id }) => id)));
        });
    } else {
      this.store.dispatch(new Send(text, this.conversationId, attachments.map(({ id }) => id)));
    }
  }

  loadMoreRequests(startFrom) {
    this.appendRequests(startFrom).subscribe((data) => {
      this.requests$ = of(data);
    });
  }

  appendRequests(startFrom): Observable<Page<RequestsList>> {
    return this.messageService.getRequests(this.user.getUserRole(), startFrom, this.pageSize, [], null).pipe(
      flatMap(({ entities }) => {
        return this.requests$.pipe(
          map(items => ({ ...items, entities: [...items.entities, ...entities] })),
        );
      }),
      takeUntil(this.destroy$)
    );
  }


  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  trackById = (i, { id }) => id;
  trackByRequestId = (i, { request: { id } }) => id;
}
