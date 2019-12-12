import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Subscription } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { UserInfoService } from "../../../user/service/user-info.service";
import { CustomValidators } from "../../../shared/forms/custom.validators";
import { switchMap } from "rxjs/operators";

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnDestroy {

  authForm: FormGroup;

  loading = false;
  subscription = new Subscription();

  constructor(
    public router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private user: UserInfoService,
    private formBuilder: FormBuilder,
  ) {
    this.authForm = this.formBuilder.group({
      'email': ['', [Validators.required, CustomValidators.email]],
      'password': ['', Validators.required]
    });
  }

  submit() {
    const { email, password } = this.authForm.value;
    this.loading = true;

    this.subscription.add(
      this.authService.login(email, password)
        .pipe(switchMap(() => this.authService.saveAuthUserData()))
        .subscribe(() => {
            // если был обратный урл, то после логина перейдем по нему
            const returnUrl = this.route.snapshot.queryParams.returnUrl || "/";
            this.router.navigate([returnUrl])
              .then(() => this.loading = false);
          },
          // если ошибка, то считаем что логин/пароль не подошли
          () => {
            this.authForm.setErrors({ invalid_credentials: true });
            this.loading = false;
          }
        ));
  }

  isFieldInvalid(field: string) {
    return this.authForm.hasError('invalid_credentials') ||
      this.authForm.get(field).errors && this.authForm.get(field).dirty;
  }

  getErrorMsg(field: string) {
    if ((field === 'email') && (this.authForm.hasError('invalid_credentials'))) {
      return '';
    }

    if ((field === 'password') && (this.authForm.hasError('invalid_credentials'))) {
      return 'Неверная эл. почта или пароль';
    }

    if (field === 'email') {
      if (this.isFieldInvalid(field) && this.authForm.controls.email.errors.required) {
        return 'Необходимо заполнить эл. почту';
      }
      if (this.isFieldInvalid(field) && this.authForm.controls.email.errors.invalid_email) {
        return 'Пожалуйста, проверьте корректность введённой эл. почты';
      }
    }

    if (field === 'password') {
      if (this.isFieldInvalid(field) && this.authForm.controls.password.errors.required) {
        return 'Необходимо заполнить пароль';
      }
    }

    return '';
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
