import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { FeatureService } from "./services/feature.service";
import { UserInfoService } from "../user/service/user-info.service";
import { AuthService } from "../auth/services/auth.service";

@Injectable({
  providedIn: 'root'
})
export class CanActivateFeatureGuard implements CanActivate {

  constructor(private router: Router, private feature: FeatureService, private userInfo: UserInfoService, private authService: AuthService) {}

  canActivate(route: ActivatedRouteSnapshot) {
    if (route.data["feature"]) {
      if (this.feature.disabled(route.data["feature"])) {
        this.router.navigate(['/not-found']);
        return false;
      }

      if (!this.feature.allowed(route.data["feature"], this.userInfo.roles)) {
        if (this.userInfo.getUserInfo()) {
          this.router.navigate(['/forbidden']);
        } else {
          const queryParams = ['/', '/auth/login'].indexOf(window.location.pathname) < 0 ? { returnUrl: window.location.pathname } : {};
          this.router.navigate(['/auth/login'], { queryParams });
        }

        return false;
      }
    }

    return true;
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot) {
    return this.canActivate(childRoute);
  }
}
