import '@clr/icons';
import '@clr/icons/shapes/all-shapes';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { filter, map, mergeMap } from "rxjs/operators";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { Title } from "@angular/platform-browser";
import { AuthService } from "./auth/services/auth.service";
import { UserInfoService } from "./user/service/user-info.service";
import { CartStoreService } from "./cart/services/cart-store.service";
import { Subscription } from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Marketplace';
  subscription = new Subscription();

  constructor(
    private authService: AuthService,
    private user: UserInfoService,
    private titleService: Title,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private cartStoreService: CartStoreService,
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
        map(event => event["title"] || this.title)
      ).subscribe((title) => {
      this.titleService.setTitle(title);
    })
    ;
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
