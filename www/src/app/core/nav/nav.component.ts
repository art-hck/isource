import { Component, OnInit } from '@angular/core';
import { AuthService, AvailableGuiService } from 'stdlib-ng/dist/core';
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

  constructor(
    public auth: AuthService,
    protected gui: AvailableGuiService,
    private router: Router,
    protected user: UserInfoService
  ) {}

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
      }
    ];
  }

  protected getCustomerMenu(): Array<MenuModel> {
    return [
      {
        text: 'Пункт меню для заказчика',
        path: 'test',
        children: []
      }
    ];
  }

  protected getBackOfficeMenu(): Array<MenuModel> {
    return [
      {
        text: 'Пункт меню для бэк-офиса',
        path: 'test',
        children: []
      }
    ];
  }

  protected getUnauthMenu(): Array<MenuModel> {
    return [
      {
        text: 'Пункт меню для гостя',
        path: 'test',
        children: []
      }
    ];
  }
}
