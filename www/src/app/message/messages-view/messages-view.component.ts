import { Component, OnInit } from '@angular/core';
import { Observable } from "rxjs";
import { MessageService } from "../messages/message.service";
import { Page } from "../../core/models/page";
import { RequestsList } from "../../request/common/models/requests-list/requests-list";
import { RequestPositionList } from "../../request/common/models/request-position-list";
import { RequestListItem } from "../../request/common/models/requests-list/requests-list-item";
import { MessageContextTypes } from "../message-context-types";
import { RequestGroup } from "../../request/common/models/request-group";
import { RequestPosition } from "../../request/common/models/request-position";
import { Uuid } from "../../cart/models/uuid";
import { map, tap } from "rxjs/operators";
import { UserInfoService } from "../../core/services/user-info.service";

@Component({
  selector: 'app-message-messages-view',
  templateUrl: './messages-view.component.html',
  styleUrls: ['./messages-view.component.scss']
})
export class MessagesViewComponent implements OnInit {

  requests$: Observable<Page<RequestsList>>;
  requestsItems$: Observable<RequestPositionList[]>;

  selectedRequest: RequestListItem;
  selectedRequestsItem: RequestPositionList;

  contextId: Uuid;
  contextType: MessageContextTypes;

  constructor(
    private messageService: MessageService,
    private user: UserInfoService
  ) {
  }

  ngOnInit() {
    this.requests$ = this.messageService
      .getRequests(this.user.getUserRole(), 0, 1000, [], null)
      .pipe(
        tap((page: Page<RequestsList>) => {
          if (page.entities.length > 0) {
            this.onRequestClick(page.entities[0].request);
          }
        })
      );
  }

  onRequestClick(request: RequestListItem) {
    this.selectedRequest = request;
    this.selectedRequestsItem = null;

    this.requestsItems$ = this.messageService.getRequestItems(this.selectedRequest.id);

    this.onRequestContextClick();
  }

  onRequestItemClick(item: RequestPositionList) {
    this.selectedRequestsItem = item;

    this.contextType = this.getContextType(item);
    this.contextId = item.id;
  }

  onRequestContextClick() {
    this.selectedRequestsItem = null;

    this.contextType = MessageContextTypes.REQUEST;
    this.contextId = this.selectedRequest.id;
  }

  getContextType(item: RequestPositionList) {
    if (item instanceof RequestPosition) {
      return MessageContextTypes.REQUEST_POSITION;
    } else if (item instanceof RequestGroup) {
      return MessageContextTypes.REQUEST_GROUP;
    }
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

  isGroup(item: RequestPositionList) {
    return item instanceof RequestGroup;
  }

  getRequestUrl() {
    const userRole = this.user.getUserRole();

    return `/requests/${userRole}/${this.selectedRequest.id}`;
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
}
