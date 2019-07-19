import { Injectable } from '@angular/core';
import { AvailableGuiService } from '@stdlib-ng/core';
import { UserInfo } from "../models/user-info";
import { Contragent } from "../models/contragent";

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
    isSupplier: 'isSupplier',
    isCustomer: 'isCustomer',
    isBackOffice: 'isBackOffice'
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

  public getUserRole(): string {
    return '';
  }

  private getStorage() {
    return window.localStorage;
  }
}
