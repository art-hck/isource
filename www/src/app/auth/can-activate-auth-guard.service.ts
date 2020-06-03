import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from "./services/auth.service";
import { UserInfoService } from "../user/service/user-info.service";
import { FeatureService } from "../core/services/feature.service";

@Injectable({
  providedIn: 'root'
})
export class CanActivateAuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.authService.isAuth()) {
      this.router.navigateByUrl("/");
      return false;
    }

    return true;
  }
}
