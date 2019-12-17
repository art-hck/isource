import { Injectable } from '@angular/core';
import { AvailableGuiService } from '@stdlib-ng/core';
import { UserInfo } from "../models/user-info";

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
    isSupplier: 'isSupplier',
    isCustomer: 'isCustomer',
    isBackOffice: 'isBackOffice',
    isSeniorBackoffice: 'isSeniorBackoffice',
    isRegularBackoffice: 'isRegularBackoffice',
    isContragentCreator: 'isContragentCreator'
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

  public isSupplier(): boolean {
    return this.getUserInfo().isSupplier;
  }

  public isCustomer(): boolean {
    return this.getUserInfo().isCustomer;
  }

  public isBackOffice(): boolean {
    return this.getUserInfo().isBackOffice;
  }

  public isSeniorBackoffice(): boolean {
    return this.getUserInfo().isSeniorBackoffice;
  }

  public isRegularBackoffice(): boolean {
    return this.getUserInfo().isRegularBackoffice;
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