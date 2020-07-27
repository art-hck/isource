import { Component, OnDestroy, OnInit } from '@angular/core';
import { Menu, MenuModel } from "../../models/menu.model";
import { Router } from "@angular/router";
import { UserInfoService } from "../../../user/service/user-info.service";
import { CartStoreService } from "../../../cart/services/cart-store.service";
import { AuthService } from "../../../auth/services/auth.service";
import { FeatureService } from "../../services/feature.service";
import { MessagesService } from "../../../message/services/messages.service";
import { map, mapTo, switchMap, takeUntil } from "rxjs/operators";
import { Observable, Subject } from "rxjs";

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit, OnDestroy {

  get menu(): MenuModel[] {
    return Menu.filter(item => !item.feature || this.featureService.available(item.feature, this.user.roles));
  }

  unreadMessagesCount$: Observable<number> = this.messagesService.unreadCount().pipe(map(({ count }) => count));
  readonly destroy$ = new Subject();

  constructor(
    public auth: AuthService,
    public user: UserInfoService,
    public cartStoreService: CartStoreService,
    public featureService: FeatureService,
    public messagesService: MessagesService
  ) {}

  ngOnInit() {
    this.messagesService.onNew().pipe(switchMap(() => this.unreadMessagesCount$), takeUntil(this.destroy$))
      .subscribe(count => this.unreadMessagesCount$ = this.unreadMessagesCount$.pipe(mapTo(count)));
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
