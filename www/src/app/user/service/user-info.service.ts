import { Injectable } from '@angular/core';
import { AvailableGuiService } from '@stdlib-ng/core';
import { UserInfo } from "../models/user-info";
import {Permission} from "../../auth/models/permission";

const USER_INFO_KEY = 'UserInfo';

@Injectable({
  providedIn: 'root'
})
export class UserInfoService {

  /**
   * В этом массиве храним мапинг полей пришедших с авторизации на беке
   * к полям в нашем объекте UserInfo
   */
  protected mapData = {
    id: 'id',
    contragentId: 'contragentId',
    contragent: 'contragent',
    username: 'username',
    firstName: 'firstName',
    lastName: 'lastName',
    middleName: 'middleName',

    isCustomer: 'isCustomer',
    isBackOffice: 'isBackOffice',
    isSupplier: 'isSupplier',
    isAdmin: 'isAdmin',

    isCustomerBuyer: 'isCustomerBuyer',

    isBackofficeBuyer: 'isBackofficeBuyer',
    isSeniorBackoffice: 'isSeniorBackoffice',

    isContragentCreator: 'isContragentCreator',

    permissions: 'permissions'
  };

  constructor(
    protected gui: AvailableGuiService
  ) {
  }

  public saveData(data: any): void {
    const userInfo = new UserInfo();

    for (const key of Object.keys(data)) {
      if (this.mapData[key]) {
        userInfo[this.mapData[key]] = data[key];
      }
    }

    this.getStorage().setItem(USER_INFO_KEY, JSON.stringify(userInfo));
  }

  public getUserInfo(): UserInfo {
    return JSON.parse(this.getStorage().getItem(USER_INFO_KEY));
  }

  public getShortUserFio(): string {
    if (!this.getUserInfo()) {
      return '';
    }
    return this.getUserInfo().firstName + ' ' + this.getUserInfo().lastName;
  }

  public getPermissions(): Permission[] {
    if (!this.getUserInfo()) {
      return [];
    }
    return this.getUserInfo().permissions;
  }

  public hasPermission(permissionType: string): boolean {
    for (const permission of this.getPermissions()) {
      if (permission.permission === permissionType) {
        return true;
      }
    }

    return false;
  }

  public isCustomer(): boolean {
    return this.getUserInfo().isCustomer;
  }

  public isBackOffice(): boolean {
    return this.getUserInfo().isBackOffice;
  }

  public isSupplier(): boolean {
    return this.getUserInfo().isSupplier;
  }

  public isAdmin(): boolean {
    return this.getUserInfo().isAdmin;
  }

  public isCustomerBuyer(): boolean {
    return this.getUserInfo().isCustomerBuyer;
  }

  public isBackofficeBuyer(): boolean {
    return this.getUserInfo().isBackofficeBuyer;
  }

  public isSeniorBackoffice(): boolean {
    return this.getUserInfo().isSeniorBackoffice;
  }

  public isContragentCreator(): boolean {
    return this.getUserInfo().isContragentCreator;
  }

  public getUserRole(): string {
    return this.isCustomer() ? 'customer' : 'backoffice';
  }

  public getUserRoleName(): string {
    return this.isCustomer() ? 'Заказчик' : 'Бэк-офис';
  }

  private getStorage() {
    return window.localStorage;
  }
}
