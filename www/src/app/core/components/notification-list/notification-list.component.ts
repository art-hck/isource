import { Component, Inject, Input, OnInit, Renderer2 } from "@angular/core";
import { DOCUMENT } from "@angular/common";
import { Observable, Subject } from "rxjs";
import { NotificationItem, Notifications } from "../../models/notifications";
import { NotificationsService } from "../../services/notifications.service";
import { take, takeUntil } from "rxjs/operators";

@Component({
  selector: 'app-notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.scss']
})
export class NotificationListComponent implements OnInit {
  notifications$: Observable<Notifications>;
  newNotifications$: Observable<NotificationItem[]>;
  openModal = false;
  destroy$ = new Subject();

  ngOnInit() {
    this.notifications$ = this.notificationsService.getNotifications();
    this.newNotifications$ = this.notificationsService.newNotifications$;
  }

  public open() {
    this.renderer.addClass(this.document.body, "aside-modal-open");
    this.renderer.addClass(this.document.body, "notifications-modal-open");
    this.openModal = true;

    this.markNotificationsAsRead();
  }

  public close() {
    this.renderer.removeClass(this.document.body, "aside-modal-open");
    this.renderer.removeClass(this.document.body, "notifications-modal-open");
    this.openModal = false;
  }

  markNotificationsAsRead() {
    const notificationsIds = [];

    this.notifications$.pipe().subscribe(({ items }) => {
      items
        .filter(item => item.status !== "STATUS_SEEN")
        .map(item => notificationsIds.push(+item.id));

      if (notificationsIds.length > 0) {
        this.notificationsService.markAsRead(notificationsIds).pipe(
          take(1),
          takeUntil(this.destroy$)
        ).subscribe(() => {
          this.notificationsService.unreadCount();
        });
      }
    });
  }

  constructor(@Inject(DOCUMENT) private document: Document, private renderer: Renderer2, public notificationsService: NotificationsService) {}
}
