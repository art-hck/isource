import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from "./services/auth.service";
import { UserInfoService } from "./services/user-info.service";

@Injectable({
  providedIn: 'root'
})
export class CanActivateGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router,
    private user: UserInfoService,
  ) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (!this.authService.isAuth()) {
      this.router.navigateByUrl("/auth/login");
      return false;
    }

    if (this.user.isCustomer()) {
      this.router.navigateByUrl("/requests/customer");
      return false;
    } else if (this.user.isBackOffice()) {
      this.router.navigateByUrl("/requests/backoffice");
      return false;
    }

    return true;
  }
}
