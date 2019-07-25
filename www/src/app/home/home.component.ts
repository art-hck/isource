import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { UserInfoService } from "../core/services/user-info.service";
import { AuthService } from "../core/services/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(
    private api: HttpClient,
    private authService: AuthService,
    public user: UserInfoService,
    protected router: Router
  ) {
  }

  ngOnInit() {
    this.redirectToRequestsList();
  }

  /**
   * Тестовый запрос. Показывает, как работать с apiService
   */
  test(): void {
    this.api
      .post('example', { param1: 'test' })
      .subscribe(
        res => {
          console.log(res);
        }
      );
  }

  // todo Убрать этот редирект с домашней страницы после появления дашбордов
  redirectToRequestsList() {
    if (this.authService.isAuth() && this.user.isCustomer()) {
      this.router.navigateByUrl(`/requests/customer`);
    } else if (this.authService.isAuth() && this.user.isBackOffice()) {
      this.router.navigateByUrl(`/requests/backoffice`);
    } else {
      return;
    }
  }

}
