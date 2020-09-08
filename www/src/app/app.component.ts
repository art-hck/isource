import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { filter, map, mergeMap, tap } from "rxjs/operators";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { Title } from "@angular/platform-browser";
import { AuthService } from "./auth/services/auth.service";
import { UserInfoService } from "./user/service/user-info.service";
import { CartStoreService } from "./cart/services/cart-store.service";
import { Subscription } from "rxjs";
import { UxgBreadcrumbsService } from "uxg";
import { FeatureService } from "./core/services/feature.service";
import { APP_CONFIG, GpnmarketConfigInterface } from "./core/config/gpnmarket-config.interface";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  subscription = new Subscription();
  isBreadcrumbsHidden: boolean;
  noContentPadding: boolean;
  noHeaderStick: boolean;
  noFooter: boolean;
  _isTitleHidden: boolean;
  readonly year = new Date().getFullYear();


  constructor(
    @Inject(APP_CONFIG) public appConfig: GpnmarketConfigInterface,
    public bc: UxgBreadcrumbsService,
    public featureService: FeatureService,
    public user: UserInfoService,
    public titleService: Title,
    public authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private cartStoreService: CartStoreService,
    private cd: ChangeDetectorRef,
  ) {
    this.router.events.pipe(
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
        this.noContentPadding = data.noContentPadding;
        this.noHeaderStick = data.noHeaderStick;
        this.noFooter = data.noFooter;
        this._isTitleHidden = data.hideTitle;
        this.bc.breadcrumbs = [];
        this.titleService.setTitle(data.title);
        this.cd.detectChanges();
      }),
    ).subscribe();
  }

  ngOnInit() {
    if (this.user.isCustomer()) {
      // Выгружаем корзину при логауте
      this.subscription
        .add(this.authService.onLogout.subscribe(() => {
          this.user.clearData();
          this.cartStoreService.cartItems = [];
        }));
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
