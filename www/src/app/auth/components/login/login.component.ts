import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserInfoService } from "../../services/user-info.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Subscription } from "rxjs";
import { switchMap } from "rxjs/operators";
import { CustomValidators } from "../../../shared/forms/custom.validators";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnDestroy {
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
      'login': ['', [Validators.required, CustomValidators.email]],
      'password': ['', Validators.required]
    });
  }

  submit() {
    const { login, password } = this.authForm.value;
    this.loading = true;

    this.subscription.add(
    this.authService.login(login, password)
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
           this.authForm.get(field).errors && (this.authForm.get(field).touched || this.authForm.get(field).dirty);
  }

  getErrorMsg(field: string) {
    if (this.authForm.hasError('invalid_credentials')) {
      return 'Неверный логин или пароль';
    }

    if (field === 'login') {
      if (this.isFieldInvalid(field) && this.authForm.controls.login.errors.required) {
        return 'Необходимо заполнить логин';
      }
      if (this.isFieldInvalid(field) && this.authForm.controls.login.errors.invalid_email) {
        return 'Пожалуйста, проверьте корректность введённого логина';
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
