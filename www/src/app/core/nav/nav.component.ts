import { Component, OnInit } from '@angular/core';
import { AuthService, AvailableGuiService } from '@stdlib-ng/core';
import { MenuModel } from "../models/menu.model";
import { Router } from "@angular/router";
import { UserInfoService } from "../services/user-info.service";

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  mainMenu: Array<MenuModel> = [];
  url: string;
  showMenu: boolean;

  constructor(
    public auth: AuthService,
    protected gui: AvailableGuiService,
    private router: Router,
    public user: UserInfoService
  ) {
    router.events.subscribe(() => {
      this.showMenu = !(this.router.url.indexOf('/login') === 0 || this.router.url.indexOf('/registration') === 0);
    });
  }

  ngOnInit() {
    this.updateMenu();
  }

  logout(): void {
    this.auth.logout().subscribe(() => {
      // полностью перезагружаем приложение после логаута
      window.location.href = "/login";
    });
  }

  public updateMenu(): void {
    if (this.auth.isAuth() && this.user.isSupplier()) {
      this.mainMenu = this.getSupplierMenu();
    } else if (this.auth.isAuth() && this.user.isCustomer()) {
      this.mainMenu = this.getCustomerMenu();
    } else if (this.auth.isAuth() && this.user.isBackOffice()) {
      this.mainMenu = this.getBackOfficeMenu();
    } else {
      this.mainMenu = this.getUnauthMenu();
    }
  }

  public isLoginPage(): boolean {
    return this.router.isActive('login', false);
  }

  protected getSupplierMenu(): Array<MenuModel> {
    return [
      {
        text: 'Пункт меню для поставщика',
        path: 'test',
        children: []
      },
      {
        text: 'Реестр заявок',
        path: 'requests/back-office',
        children: []
      }
    ];
  }

  protected getCustomerMenu(): Array<MenuModel> {
    return [
      {
        text: 'Каталог',
        path: 'catalog',
        children: []
      },
      {
        text: 'Новая заявка',
        path: 'requests/create',
        children: []
      },
      {
        text: 'Реестр заявок',
        path: 'requests/customer',
        children: []
      }
    ];
  }

  protected getBackOfficeMenu(): Array<MenuModel> {
    return [
      {
        text: 'Реестр заявок',
        path: 'requests/back-office',
        children: []
      }
    ];
  }

  protected getUnauthMenu(): Array<MenuModel> {
    return [
      {
        text: '',
        path: 'test',
        children: []
      }
    ];
  }
}
