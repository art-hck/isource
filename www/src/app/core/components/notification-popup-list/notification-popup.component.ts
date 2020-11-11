import {
  Component,
  Inject,
  InjectionToken,
  Input,
  OnInit,
  PLATFORM_ID,
} from "@angular/core";
import { DOCUMENT, isPlatformBrowser } from "@angular/common";
import { Observable, Subject } from "rxjs";
import { NotificationsService } from "../../services/notifications.service";
import { animate, state, style, transition, trigger } from "@angular/animations";
import { NotificationItem } from "../../models/notifications";
import { take, takeUntil, tap } from "rxjs/operators";

@Component({
  selector: 'app-notification-popup',
  templateUrl: './notification-popup.component.html',
  animations: [trigger('notificationAnimate', [
    state('void', style({
      opacity: '0',
      transform: 'translateY(-162px)',
      transformOrigin: 'top center',
      height: '0px',
    })),
    state('*', style({
      opacity: '1',
    })),
    transition('void => *', [animate('.3s ease-out')]),
    transition('* => void', [animate('0s ease-out')]),
  ])],
  styleUrls: ['./notification-popup.component.scss']
})
export class NotificationPopupComponent implements OnInit {

  @Input() view: 'popup' | 'list';

  newNotifications$: Observable<NotificationItem[]> = this.notificationsService.newNotifications$;
  destroy$ = new Subject();

  constructor(
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: InjectionToken<Object>,
    public notificationsService: NotificationsService,
  ) {}

  ngOnInit() {
    this.hideAllNotifications();

    // Если текущий режим отображения «список» шторки, то при получении новых уведомлений помечаем их как просмотренные
    this.notificationsService.onNew().pipe(
      tap((notification) => {
          if (this.view === 'list' && document.body.classList.contains('notifications-modal-open')) {
            this.notificationsService.markAsRead([notification.id]).pipe(
              take(1),
              takeUntil(this.destroy$)
            ).subscribe(() => this.notificationsService.unreadCount());
          }
      }),
      takeUntil(this.destroy$)
    ).subscribe();
  }

  get windowHeight(): number {
    return isPlatformBrowser(this.platformId) ? window.innerHeight : 0;
  }

  /**
   * Возвращает максимальное кол-во всплывающих уведомлений, влезающих в высоту экрана
   */
  get maxPopupCount(): number {
    // todo Высота блока уведомлений на данный момент фиксированная,
    //  поэтому значение для вычисления тоже захардкожено.
    //  Лучше в будущем реализовать универсальное решение для любой высоты блока нотификации
    return Math.floor((this.windowHeight - 50) / 158);
  }

  hideNotification(notification, event = null) {
    if (this.view === 'popup') {
      event?.preventDefault();
      event?.stopPropagation();

      this.notificationsService.notificationAction$.next({ action: 'close', notification });
    }
  }

  hideAllNotifications() {
    this.notificationsService.notificationAction$.next({ action: 'closeAll' });
  }

  readNotification(notification) {
    this.notificationsService.markAsRead([notification.id]).pipe(
      take(1),
      takeUntil(this.destroy$)
    ).subscribe(() => this.notificationsService.unreadCount());
  }
}
