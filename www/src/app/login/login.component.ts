import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { UserInfoService } from "../core/services/user-info.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CustomValidators } from "../shared/forms/custom.validators";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  authForm: FormGroup;

  login: string;
  password: string;

  loginError = false;
  loading = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private user: UserInfoService,
    private formBuilder: FormBuilder,
  ) {
    this.authForm = this.formBuilder.group({
        'login': ['', Validators.required],
        'password': ['', Validators.required]
      }
    );
  }

  ngOnInit() {
  }

  onLoginClick() {
    // бек может быть медленным - поэтому ждем пока запрос не выполниться
    if (this.loading) {
      return;
    }

    this.loading = true;

    this.authService.login(
      this.authForm.value['login'],
      this.authForm.value['password']
    ).subscribe(() => {
        this.authService.saveAuthUserData()
          .subscribe(() => {
            this.loading = false;

            // если был обратный урл, то после логина перейдем по нему
            const returnUrl = this.route.snapshot.queryParams.returnUrl;

            // самый безопасный способ обновить с нуля страницу
            // todo потом желательно переделать на авторизацию без перезагрузки
            window.location.href = returnUrl ? decodeURI(returnUrl) : this.getStartPageUrlByRole();
          });
      }, () => {
        // если ошибка, то считаем что логин/пароль не подошли
        this.loading = false;
        this.loginError = true;
      });
  }

  // Определяем стартовую страницу после авторизации для каждой роли
  getStartPageUrlByRole() {
    if (this.user.isCustomer()) {
      return "/requests/customer";
    } else if (this.user.isBackOffice()) {
      return "/requests/backoffice";
    } else {
      return "/";
    }
  }

  onRegistrationClick() {
      this.router.navigateByUrl(`registration`);
  }

  isFieldInvalid(field: string) {
    return this.authForm.get(field).errors
      && (this.authForm.get(field).touched || this.authForm.get(field).dirty);
  }
}
