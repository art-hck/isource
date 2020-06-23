import { Component } from '@angular/core';
import { Menu, MenuModel } from "../../models/menu.model";
import { Router } from "@angular/router";
import { UserInfoService } from "../../../user/service/user-info.service";
import { CartStoreService } from "../../../cart/services/cart-store.service";
import { AuthService } from "../../../auth/services/auth.service";
import { FeatureService } from "../../services/feature.service";

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent {

  get menu(): MenuModel[] {
    return Menu.filter(item => !item.feature || this.featureService.available(item.feature, this.user.roles));
  }

  constructor(
    private router: Router,
    public auth: AuthService,
    public user: UserInfoService,
    public cartStoreService: CartStoreService,
    public featureService: FeatureService
  ) {}

  get userBriefInfo(): string {
    return this.user.isCustomer() ? this.user.getUserInfo()?.contragent.shortName : 'Бэк-офис';
  }

  logout(): void {
    this.auth.logout();
  }
}
