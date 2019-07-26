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
    if (!this.authService.isAuth()) {
      this.router.navigateByUrl("/login");
    } else {
      this.redirectToRequestsList();
    }
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
    const userRole = this.user.isCustomer() ? "customer" : "back-office";
    this.router.navigateByUrl("/requests/" + userRole);
  }

}
