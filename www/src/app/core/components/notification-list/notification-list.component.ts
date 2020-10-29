import { Component, Inject, Input, OnInit, Renderer2 } from "@angular/core";
import { DOCUMENT } from "@angular/common";
import { NotificationsActions } from "../../actions/notifications.actions";
import { Select, Store } from "@ngxs/store";
import { Observable } from "rxjs";
import { NotificationsState } from "../../states/notifications.state";
import { Notifications } from "../../models/notifications";
import { StateStatus } from "../../../request/common/models/state-status";

@Component({
  selector: 'app-notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.scss']
})
export class NotificationListComponent implements OnInit {
  @Select(NotificationsState.notifications) notifications$: Observable<Notifications>;
  @Select(NotificationsState.status) status$: Observable<StateStatus>;

  openModal = false;

  ngOnInit() {
    this.store.dispatch(new NotificationsActions.Fetch());
  }

  public open() {
    this.renderer.addClass(this.document.body, "aside-modal-open");
    this.openModal = true;
  }

  public close() {
    this.renderer.removeClass(this.document.body, "aside-modal-open");
    this.openModal = false;
  }

  constructor(@Inject(DOCUMENT) private document: Document, private renderer: Renderer2, private store: Store) {}
}
