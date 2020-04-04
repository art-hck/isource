import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from "./services/auth.service";
import { UserInfoService } from "../user/service/user-info.service";
import { FeatureService } from "../core/services/feature.service";

@Injectable({
  providedIn: 'root'
})
export class CanActivateGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private featureService: FeatureService,
    private router: Router,
    private user: UserInfoService,
  ) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (!this.authService.isAuth()) {
      this.router.navigateByUrl("/auth/login");
      return false;
    }

    if (this.user.isCustomer()) {
      const url = this.featureService.authorize("dashboard") ? "/dashboard" : "/requests/customer";
      this.router.navigateByUrl(url);
      return false;
    } else if (this.user.isBackOffice()) {
      this.router.navigateByUrl("/requests/backoffice");
      return false;
    }

    return true;
  }
}
