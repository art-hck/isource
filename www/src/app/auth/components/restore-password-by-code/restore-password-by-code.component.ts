import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "../../services/auth.service";
import { ClrLoadingState } from "@clr/angular";
import { NotificationService } from "../../../shared/services/notification.service";
import { Subscription } from "rxjs";

@Component({
  selector: 'app-restore-password-by-code',
  templateUrl: './restore-password-by-code.component.html',
  styleUrls: ['./restore-password-by-code.component.scss']
})
export class RestorePasswordByCodeComponent implements OnInit, OnDestroy {
  code: string;
  subscription = new Subscription();
  loadingState: ClrLoadingState;
  form = new FormGroup({
      code: new FormControl(null),
      password: new FormControl("", Validators.required),
      retypePassword: new FormControl("", Validators.required),
    },
    (form: FormGroup) =>
      form.get("password").value === form.get("retypePassword").value ? null : { password_mismatch: true }
  );

  get isPasswordInvalid(): boolean {
    return this.form.hasError('password_mismatch') && this.form.touched && this.form.dirty;
  }

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService,
  ) {
  }

  ngOnInit() {
    this.code = this.route.snapshot.queryParams.code;
    if (this.code) {
      this.form.get("code").setValue(this.code);
    } else {
      this.router.navigate(["/"]);
    }
  }

  submit() {
    if (this.form.invalid) {
      return;
    }

    const { password, code } = this.form.value;
    this.loadingState = ClrLoadingState.LOADING;

    this.subscription.add(
      this.authService.changePasswordByCode(password, code).subscribe(
        () => {
          this.router.navigate(["/"]);
          this.notificationService.toast("Пароль успешно изменен", "success");
        },
        () => {
          this.notificationService.toast("Ошибка смены пароля", "error");
          this.loadingState = ClrLoadingState.ERROR;
        }
      )
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
