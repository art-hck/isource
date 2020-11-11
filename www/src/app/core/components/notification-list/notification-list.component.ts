import { Component, Inject, Input, OnInit, Renderer2 } from "@angular/core";
import { DOCUMENT } from "@angular/common";
import { Observable } from "rxjs";
import { NotificationItem, Notifications } from "../../models/notifications";
import { NotificationsService } from "../../services/notifications.service";

@Component({
  selector: 'app-notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.scss']
})
export class NotificationListComponent implements OnInit {
  notifications$: Observable<Notifications>;
  newNotifications$: Observable<NotificationItem[]>;
  openModal = false;

  ngOnInit() {
    this.notifications$ = this.notificationsService.getNotifications();
    this.newNotifications$ = this.notificationsService.newNotifications$;
  }

  public open() {
    this.renderer.addClass(this.document.body, "aside-modal-open");
    this.renderer.addClass(this.document.body, "notifications-modal-open");
    this.openModal = true;
  }

  public close() {
    this.renderer.removeClass(this.document.body, "aside-modal-open");
    this.renderer.removeClass(this.document.body, "notifications-modal-open");
    this.openModal = false;
  }

  constructor(@Inject(DOCUMENT) private document: Document, private renderer: Renderer2, public notificationsService: NotificationsService) {}
}
