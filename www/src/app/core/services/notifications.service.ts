import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { NotificationItem, Notifications } from "../models/notifications";
import { map, scan, takeUntil, tap } from "rxjs/operators";
import { WsNotificationsService } from "../../websocket/services/ws-notifications.service";
import { WsNotificationTypes } from "../../websocket/enum/ws-notification-types";
import { BehaviorSubject, Observable, Subject } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class NotificationsService {

  destroy$ = new Subject();

  readonly notificationAction$ = new BehaviorSubject<{ action: string, notification?: NotificationItem }>(null);

  readonly newNotifications$: Observable<NotificationItem[]> = this.notificationAction$.pipe(
    takeUntil(this.destroy$),
    scan((acc, notificationAction) => {
      const audio = new Audio();

      audio.src = "/assets/new-notification.mp3";
      audio.load();

      if (notificationAction?.notification && notificationAction.action === "add") {
        const i = acc.findIndex(({ id }) => notificationAction.notification?.id === id);
        if (i !== -1) {
          acc[i] = notificationAction.notification;
        } else {
          acc.unshift(notificationAction.notification);
          audio.play().then(r => {});
        }
      } else if (notificationAction?.notification && notificationAction.action === "close") {
        const i = acc.findIndex(({ id }) => notificationAction.notification.id === id);
        i !== -1 ? acc.splice(i, 1) : acc[i] = notificationAction.notification;
      } else if (notificationAction?.action === "closeAll") {
        acc = [];
      }

      return acc;
    }, [])
  );

  constructor(private ws: WsNotificationsService, private api: HttpClient) {
    this.listenNotifications();
  }

  private listenNotifications() {
    this.onNew().pipe(
      tap((notification) => {
        console.log(notification);
        notification.body = JSON.parse(notification.body as string);
        this.notificationAction$.next({ action: 'add', notification });
      }),
      takeUntil(this.destroy$)
    ).subscribe();
  }

  getNotifications() {
    const url = `#notifications#`;
    return this.api.get<Notifications>(url, {params: {limit: '10', channel: '1'}}).pipe(map(
      notifications => {
        notifications.items = notifications.items.map(item => {
          item.body = JSON.parse(item.body as string);
          return item;
        });
        return notifications;
      }
    ));
  }

  get() {
    return this.ws.send<NotificationItem[]>(`notifications.get`);
  }

  unreadCount() {
    return this.ws.send<{ count: number }>(`notifications.unreadcount`);
  }

  onNew() {
    return this.ws.on<NotificationItem>(WsNotificationTypes.NOTIFICATION_NEW);
  }
}
