import { Component, OnDestroy, OnInit } from '@angular/core';
import { Menu, MenuModel } from "../../models/menu.model";
import { UserInfoService } from "../../../user/service/user-info.service";
import { CartStoreService } from "../../../cart/services/cart-store.service";
import { AuthService } from "../../../auth/services/auth.service";
import { FeatureService } from "../../services/feature.service";
import { MessagesService } from "../../../chat/services/messages.service";
import { filter, map, mapTo, switchMap, takeUntil, tap, withLatestFrom } from "rxjs/operators";
import { BehaviorSubject, fromEvent, iif, interval, merge, NEVER, Subject } from "rxjs";
import { Title } from "@angular/platform-browser";
import { NavigationEnd, Router } from "@angular/router";

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit, OnDestroy {

  get menu(): MenuModel[] {
    return Menu.filter(item => !item.feature || this.featureService.available(item.feature, this.user.roles));
  }

  readonly unreadMessagesCount$ = new BehaviorSubject<number>(0);
  readonly destroy$ = new Subject();

  constructor(
    private router: Router,
    public title: Title,
    public auth: AuthService,
    public user: UserInfoService,
    public cartStoreService: CartStoreService,
    public featureService: FeatureService,
    public messagesService: MessagesService
  ) {}

  ngOnInit() {
    this.messagesService.unreadCount().pipe(takeUntil(this.destroy$))
      .subscribe(({count}) => this.unreadMessagesCount$.next(count));

    this.messagesService.onNew().pipe(
      filter(m => m.author.uid !== this.user.getUserInfo().id),
      takeUntil(this.destroy$)
    ).subscribe(() => this.unreadMessagesCount$.next(this.unreadMessagesCount$.getValue() + 1));

    this.messagesService.onMarkSeen().pipe(takeUntil(this.destroy$))
      .subscribe(({ updated }) => this.unreadMessagesCount$.next(this.unreadMessagesCount$.getValue() - updated));

    const title$ = this.router.events.pipe(filter(e => e instanceof NavigationEnd), map(() => this.title.getTitle()));
    const audio = new Audio();

    audio.src = "/assets/new-message.mp3";
    audio.load();

    merge(
      this.messagesService.onNew().pipe(mapTo(true)),
      fromEvent(document, 'visibilitychange').pipe(mapTo(false))
    ).pipe(
      filter(newMessage => document.visibilityState === 'hidden' === newMessage),
      tap(newMessage => newMessage && audio.play()),
      withLatestFrom(title$),
      tap(([newMessage, title]) => this.title.setTitle(title)),
      switchMap(([newMessage]) => iif(() => newMessage, interval(1000))),
      withLatestFrom(title$),
    ).subscribe(([i, title]) => this.title.setTitle(i % 2 ? title : "Новое сообщение!"));
  }

  get userBriefInfo(): string {
    return this.user.isCustomer() ? this.user.getUserInfo()?.contragent.shortName : 'Бэк-офис';
  }

  logout(): void {
    this.auth.logout();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
