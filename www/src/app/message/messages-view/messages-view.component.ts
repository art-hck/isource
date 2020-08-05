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
import { debounceTime, flatMap, map, shareReplay, take, takeUntil, tap } from "rxjs/operators";
import { UserInfoService } from "../../user/service/user-info.service";
import { RequestItemsStore } from '../data/request-items-store';
import { ActivatedRoute, Router } from "@angular/router";
import { MessagesService } from "../services/messages.service";
import { Conversation } from "../models/conversation";
import { ConversationsService } from "../services/conversations.service";
import { Attachment } from "../models/attachment";
import { Request } from "../../request/common/models/request";
import { ContextsService } from "../services/contexts.service";

@Component({
  selector: 'app-message-messages-view',
  templateUrl: './messages-view.component.html',
  styleUrls: ['./messages-view.component.scss']
})
export class MessagesViewComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('requestsSearchField') requestsSearchField: ElementRef;

  requestId: Uuid;
  positionId: Uuid;

  requests$: Observable<Page<RequestsList>>;
  requestsItems$: Observable<RequestPositionList[]>;

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
    private cd: ChangeDetectorRef
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

  fetchCounters() {
    this.requestsItems$.pipe(take(1), flatMap(data => {
        const conversationIds = data.filter(item => item?.conversation?.externalId).map(item => item.conversation.externalId);
        return this.conversationsService.get(conversationIds);
      }),
      takeUntil(this.destroy$)
    ).subscribe(conversations => {
      this.requestsItems$ = this.requestsItems$?.pipe(map(requestItems => {
          (conversations ?? []).forEach(conversation => {
            const requestItem = requestItems.find(item => item.conversation?.externalId === conversation.id);
            if (requestItem) {
              requestItem.conversation.unreadCount = conversation.unreadCount;
            }
          });

          return requestItems;
        })
      );
    });

    this.requests$.pipe(take(1), flatMap(({ entities }) => {
        const contextIds = entities.filter(({request}) => request?.context?.externalId).map(({request}) => request?.context?.externalId);
        return this.contextsService.get(contextIds);
      })
    ).subscribe(contexts => {
      this.requests$ = this.requests$.pipe(map(requests => {
        (contexts ?? []).forEach(context => {
          const request = requests.entities.find(({request: r}) => r.context?.externalId === context.id);
          if (request) {
            request.request.context.unreadCount = context.unreadCount;
          }
        });
        return requests;
      }));
    });
  }

  ngOnInit() {
    this.getRouteData();

    this.requests$ = this.messageService
      .getRequests(this.user.getUserRole(), 0, this.pageSize, [], null).pipe(
        tap((page: Page<RequestsList>) => {
          if (page.entities.length > 0) {
            this.requestEntities = page.entities;
            this.jumpToRequestOrPosition();
          }
        }),
        shareReplay(1)
      );

    merge(this.messageService.onNew(), this.messageService.onMarkSeen()).pipe(
      debounceTime(100),
      takeUntil(this.destroy$)
    ).subscribe(() => this.fetchCounters());

    this.conversationsService.onNew().pipe(takeUntil(this.destroy$)).subscribe((conversation => {
      const requestId: Request['id'] = JSON.parse(conversation.context.items[0].data).contextId;
      this.requests$ = this.requests$.pipe(map(requests => {
        const index = requests.entities.findIndex(({ request: { id } }) => id === requestId);

        if (index !== -1) {
          requests.entities[index].request.conversation = { id: null, externalId: conversation.id };

          if (requests.entities[index].request.id === this.selectedRequest.id && !this.selectedRequestsItem) {
            this.selectedRequest = requests.entities[index].request;
            this.onRequestContextClick();
          }
        }

        return requests;
      }), shareReplay(1));

      this.messageService.getRequestItems(this.selectedRequest.id, this.user.getUserRole()).pipe(
        tap(data => {
          this.requestsItems = new RequestItemsStore();
          this.requestsItems.setRequestItems(data);
          this.conversationId = data.find(item => item.id === this.contextId)?.conversation?.externalId;
        }),
        takeUntil(this.destroy$)
      ).subscribe(data => this.requestsItems$ = of(data));
    }));
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
        return widthGroups ?  [...arr, curr, ...flatPositionList(curr.positions, null)] : [...arr, ...flatPositionList(curr.positions, null)];
      } else {
        return [...arr, curr].filter(Boolean);
      }
    }, []);
  }

  jumpToRequestOrPosition(): void {
    if (this.positionId && this.requestId) {
      // Выбор заявки в списке
      const requestToSelect = this.requestEntities.filter(
        request => request.request.id === this.requestId
      );
      this.onRequestClick(requestToSelect[0].request);

      // Выбор позиции в списке
      this.requestsItems$.pipe(takeUntil(this.destroy$)).subscribe(requestItems => {
        const flatPositionsList = this.getRequestPositionsFlat(requestItems);

        const requestItemToSelect = Object.values(flatPositionsList).filter(
          requestItem => requestItem.id === this.positionId
        );
        this.onRequestItemClick(requestItemToSelect[0]);
      });
    } else if (this.requestId) {
      // Выбор заявки в списке
      const requestToSelect = this.requestEntities.filter(
        request => request.request.id === this.requestId
      );
      this.onRequestClick(requestToSelect[0].request);
    } else {
      this.onRequestClick(this.requestEntities[0].request);
    }
  }

  onRequestClick(request: RequestListItem) {
    this.selectedRequest = request;
    this.selectedRequestsItem = null;

    this.requestsItems$ = this.messageService.getRequestItems(this.selectedRequest.id, this.user.getUserRole()).pipe(
      tap(data => {
        this.requestsItems = new RequestItemsStore();
        this.requestsItems.setRequestItems(data);
      }),
      shareReplay(1)
    );

    this.onRequestContextClick();
  }

  onRequestItemClick(item: (RequestPositionList | RequestGroup | RequestPosition)) {
    this.selectedRequestsItem = item;
    const requestItemType = this.getRequestEntityUrlNameByType(this.selectedRequestsItem);

    this.contextType = MessagesViewComponent.getContextType(item);
    this.contextId = MessagesViewComponent.getContextId(item);
    this.conversationId = this.selectedRequestsItem.conversation?.externalId;
    this.cd.detectChanges();

    this.router.navigate(
      ['messages/request/' + this.selectedRequest.id + '/' + requestItemType + '/' + this.selectedRequestsItem.id],
      { replaceUrl: true}
    );
  }

  /**
   * Функция преобразовывает тип элемента внутри заявки в представление для ссылки
   * (.../position/... или .../group/...)
   *
   * @param entityType
   */
  getRequestEntityUrlNameByType({entityType}: RequestPositionList | RequestGroup | RequestPosition): string {
    switch (entityType) {
      case 'POSITION':
        return 'position';
      case 'GROUP':
        return 'group';
      default:
        return 'position';
    }
  }

  onRequestContextClick() {
    this.selectedRequestsItem = null;

    this.contextType = MessageContextTypes.REQUEST;
    this.contextId = this.selectedRequest.id;
    this.conversationId = this.selectedRequest.conversation?.externalId;

    this.router.navigate(
      ['messages/request/' + this.selectedRequest.id],
      { replaceUrl: true}
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
      return {name: item.status, label: item.statusLabel};
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
      this.conversationsService.apiCreate(this.contextType, this.contextId).pipe(
        tap(({ externalId }) => this.messageService.send(text, externalId, attachments.map(({ id }) => id))),
        takeUntil(this.destroy$)
      ).subscribe();
    } else {
      this.messageService.send(text, this.conversationId, attachments.map(({ id }) => id));
    }
  }

  appendRequests(startFrom) {
    this.messageService.getRequests(this.user.getUserRole(), startFrom, this.pageSize, [], null).pipe(
      flatMap(({ entities }) => {
        return this.requests$.pipe(
          map(items => ({ ...items, entities: [...items.entities, ...entities] })),
        );
      }),
      takeUntil(this.destroy$)
    ).subscribe(data => {
        this.requests$ = of(data);
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  trackById = (i, { id }) => id;
  trackByRequestId = (i, { request: { id } }) => id;
}
