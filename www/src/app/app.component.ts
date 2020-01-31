import '@clr/icons';
import '@clr/icons/shapes/all-shapes';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { filter, map, mergeMap, tap } from "rxjs/operators";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { Title } from "@angular/platform-browser";
import { AuthService } from "./auth/services/auth.service";
import { UserInfoService } from "./user/service/user-info.service";
import { CartStoreService } from "./cart/services/cart-store.service";
import { Subscription } from "rxjs";
import { UxgBreadcrumbsService } from "uxg";
import { FeatureService } from "./core/services/feature.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Marketplace';
  subscription = new Subscription();
  isBreadcrumbsHidden: boolean;
  noContainerPadding: boolean;
  _isTitleHidden: boolean;

  get isTitleHidden() {
    const title =  this.titleService.getTitle();
    return this._isTitleHidden || title === "Загрузка..." || title === this.title;
  }

  constructor(
    private authService: AuthService,
    private featureService: FeatureService,
    private user: UserInfoService,
    private titleService: Title,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private cartStoreService: CartStoreService,
    private bc: UxgBreadcrumbsService,
  ) {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => this.activatedRoute),
        map(route => {
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        }),
        filter(route => route.outlet === "primary"),
        mergeMap(route => route.data),
        tap(data => {
          this.isBreadcrumbsHidden = data.hideBreadcrumbs;
          this.noContainerPadding = data.noContainerPadding;
          this._isTitleHidden = data.hideTitle;
          this.bc.breadcrumbs = [];
        }),
        map(event => event["title"] || this.title)
      ).subscribe((title) => {
      this.titleService.setTitle(title);
    });
  }

  ngOnInit() {
    // Загружаем корзину, если заказчик
    if (!this.authService.isAuth()) {
      this.subscription.add(
        this.authService.onLogin.subscribe(() => {
          if (this.user.isCustomer()) {
            this.cartStoreService.load();
          }
        })
      );
    } else if (this.user.isCustomer()) {
      this.cartStoreService.load();
      // Выгружаем корзину при логауте
      this.subscription
        .add(this.authService.onLogout.subscribe(() => {
          this.cartStoreService.cartItems = [];
        }));
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
