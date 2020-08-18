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
import { debounceTime, filter, flatMap, map, shareReplay, switchMap, take, takeUntil, tap } from "rxjs/operators";
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

  requestId: Uuid;
  positionId: Uuid;

  // requests$: Observable<Page<RequestsList>>;
  // requestsItems$: Observable<RequestPositionList[]>;

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

    this.conversationsService.onNew().pipe(takeUntil(this.destroy$)).subscribe((() => {
      this.store.dispatch(new Update(this.user.getUserRole(), 0, this.pageSize, [], null));
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
        return widthGroups ? [...arr, curr, ...flatPositionList(curr.positions, null)] : [...arr, ...flatPositionList(curr.positions, null)];
      } else {
        return [...arr, curr].filter(Boolean);
      }
    }, []);
  }

  jumpToRequestOrPosition(): void {
    let requestEntities = [];
    let requestToSelect = [];

    if (this.requestId) {
      // Выбор заявки в списке
      this.requests$.pipe(takeUntil(this.destroy$)).subscribe((requests) => {
        requestEntities = requests.entities;
        requestToSelect = requestEntities.filter(
          ({ request }) => {
            return request.id === this.requestId;
          });

        if (!requestToSelect || requestToSelect.length === 0) {
          this.appendRequests(requestEntities.length).subscribe((data) => {
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
      this.onRequestClick(requestEntities[0].request);
    }

    // Прокручиваем в списке заявок и позиций до выделенных элементов
    setTimeout(() => {
      const selectedItems = document.querySelectorAll('li.selected');
      selectedItems.forEach(el => el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' }));
    }, 100);
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
    this.conversationId = this.selectedRequestsItem.conversation?.externalId;
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
    this.conversationId = this.selectedRequest.conversation?.externalId;

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
      this.store.dispatch(new CreateConversation(this.contextType, this.contextId, text, attachments.map(({ id }) => id))).pipe(
        tap(({ externalId }) => this.store.dispatch(new Send(text, externalId, attachments.map(({ id }) => id))).pipe(
          switchMap(() => this.store.dispatch(new Get(externalId)))
        )),
        shareReplay(1),
        takeUntil(this.destroy$)
      ).subscribe();
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
