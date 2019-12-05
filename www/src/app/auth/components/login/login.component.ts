import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserInfoService } from "../../services/user-info.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Subscription } from "rxjs";
import { switchMap } from "rxjs/operators";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnDestroy {
  form: FormGroup;

  loading = false;
  subscription = new Subscription();

  constructor(
    public router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private user: UserInfoService,
    private formBuilder: FormBuilder,
  ) {
    this.form = this.formBuilder.group({
      'login': ['', Validators.required],
      'password': ['', Validators.required]
    });
  }

  submit() {
    const { login, password } = this.form.value;
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
          this.form.setErrors({ invalid_credentials: true });
          this.loading = false;
        }
      ));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
