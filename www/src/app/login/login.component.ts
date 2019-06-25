import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  login: string;
  password: string;

  loginError = false;
  loading = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
  ) {
  }

  ngOnInit() {
  }

  onLoginClick() {
    // бек может быть медленным - поэтому ждем пока запрос не выполниться
    if (this.loading) {
      return;
    }

    this.loading = true;

    this.authService.login(this.login, this.password)
      .subscribe(() => {
        this.authService.saveAuthUserData()
          .subscribe(() => {
            this.loading = false;

            // если был обратный урл, то после логина перейдем по нему
            const returnUrl = this.route.snapshot.queryParams.returnUrl;

            // самый безопасный способ обновить с нуля страницу
            // todo потом желательно переделать на авторизацию без перезагрузки
            window.location.href = returnUrl ? decodeURI(returnUrl) : "/";
          });
      }, () => {
        // если ошибка, то считаем что логин/пароль не подошли
        this.loading = false;
        this.loginError = true;
      });
  }

  onRegistrationClick() {
      this.router.navigateByUrl(`registration`);
  }
}
