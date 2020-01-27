import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { FeatureService } from "./services/feature.service";
import { UserInfoService } from "../user/service/user-info.service";
import { UserRole } from "../user/models/user-role";

@Injectable({
  providedIn: 'root'
})
export class CanActivateFeatureGuard implements CanActivate {

  constructor(private router: Router, private feature: FeatureService, private userInfo: UserInfoService) {}

  canActivate(route: ActivatedRouteSnapshot) {
    if (route.data["feature"]) {
      if (this.feature.disabled(route.data["feature"])) {
        this.router.navigate(['404']);
        return false;
      }

      if (!this.feature.allowed(route.data["feature"], this.roles)) {
        this.router.navigate(['/forbidden']);
        return false;
      }
    }

    return true;
  }

  /* @TODO лучше если бэк будет присылать список ролей массивом */
  get roles(): UserRole[] {
    const roles: UserRole[] = [];
    if (this.userInfo.isBackOffice()) { roles.push(UserRole.BACKOFFICE); }
    if (this.userInfo.isCustomer()) { roles.push(UserRole.CUSTOMER); }
    if (this.userInfo.isSeniorBackoffice()) { roles.push(UserRole.SENIOR_BACKOFFICE); }
    if (this.userInfo.isRegularBackoffice()) { roles.push(UserRole.REGULAR_BACKOFFICE); }
    if (this.userInfo.isSupplier()) { roles.push(UserRole.SUPPLIER); }

    return roles;
  }
}
