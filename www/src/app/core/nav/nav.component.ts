import { Component } from '@angular/core';
import { Menu, MenuModel } from "../models/menu.model";
import { Router } from "@angular/router";
import { UserInfoService } from "../../user/service/user-info.service";
import { CartStoreService } from "../../cart/services/cart-store.service";
import { AuthService } from "../../auth/services/auth.service";
import { FeatureService } from "../services/feature.service";

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent {

  get menu(): MenuModel[] {
    return Menu.filter(item => !item.feature || this.featureService.available(item.feature, this.user.roles));
  }

  get isMenuHidden(): boolean {
    return this.router.isActive('auth/login', false) ||
      this.router.isActive('auth/registration', false) ||
      this.router.isActive('auth/forgot-password', false) ||
      this.router.isActive('auth/change-password', false) ||
      this.router.isActive('activate', false);
  }

  constructor(
    private router: Router,
    public auth: AuthService,
    public user: UserInfoService,
    public cartStoreService: CartStoreService,
    public featureService: FeatureService
  ) {}

  getUserBriefInfo(user: UserInfoService): string {
    return user.isCustomer() ?
      (user.getUserInfo().contragent ? user.getUserInfo().contragent.shortName : '') :
      'Бэк-офис';
  }

  logout(): void {
    this.router.navigate(["auth/login"]);
    const subscription = this.auth.logout().subscribe(() => subscription.unsubscribe());
  }
}
