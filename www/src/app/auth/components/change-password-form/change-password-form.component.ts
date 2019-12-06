import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ClrLoadingState } from "@clr/angular";
import { Subscription } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { CustomValidators } from "../../../shared/forms/custom.validators";
import { NotificationService } from "../../../shared/services/notification.service";

@Component({
  selector: 'app-change-password-form',
  templateUrl: './change-password-form.component.html',
  styleUrls: ['./change-password-form.component.scss']
})
export class ChangePasswordFormComponent implements OnInit {

  passwordHintSheetShown = false;

  code: string;
  errorMsg: string;

  loadingState = <ClrLoadingState>0;
  clrLoadingState = ClrLoadingState;
  subscription = new Subscription();

  passwordChangeForm = new FormGroup({
      code: new FormControl(null),
      password: new FormControl("", [Validators.required, CustomValidators.password]),
      retypePassword: new FormControl("", [Validators.required, CustomValidators.password]),
    },
    (form: FormGroup) =>
      (form.get("retypePassword").value === "" || (form.get("password").value === form.get("retypePassword").value)) ?
          null : { password_mismatch: true }
  );

  constructor(
    public router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private authService: AuthService,
  ) {
  }

  ngOnInit() {
    this.code = this.route.snapshot.queryParams.code;

    if (this.code) {
      this.passwordChangeForm.get('code').setValue(this.code);
    } else {
      this.router.navigate(["auth/forgot-password"]);
    }
  }

  getErrorMsg(field: string) {
    if ((field === 'retypePassword') && (this.passwordChangeForm.hasError('password_mismatch'))) {
      return 'Пароли не совпадают';
    }

    if (field === 'password') {
      if (this.isFieldInvalid(field) && this.passwordChangeForm.controls.password.errors.required) {
        return 'Необходимо заполнить новый пароль';
      }
      if (this.isFieldInvalid(field) && this.passwordChangeForm.controls.password.errors.invalid_password) {
        return 'Пароль не соответствует требованиям политики безопасности';
      }
    }

    if (field === 'retypePassword') {
      if (this.isFieldInvalid(field) && this.passwordChangeForm.controls.retypePassword.errors.required) {
        return 'Необходимо повторно заполнить новый пароль';
      }
      if (this.isFieldInvalid(field) && this.passwordChangeForm.controls.retypePassword.errors.invalid_password) {
        return 'Пароль не соответствует требованиям политики безопасности';
      }
    }

    return '';
  }

  submit() {
    if (this.passwordChangeForm.invalid) {
      return;
    }

    const { password, code } = this.passwordChangeForm.value;
    this.loadingState = ClrLoadingState.LOADING;

    this.subscription.add(
      this.authService.changePasswordByCode(password, code).subscribe(
        () => {
          this.loadingState = ClrLoadingState.SUCCESS;
        },
        (data) => {
          this.errorMsg = data.error.detail;
          this.loadingState = ClrLoadingState.ERROR;
        }
      )
    );
  }

  getPasswordExpireDate() {
    // todo дата генерится на фронте временно, позже будет подтягиватся из ответа с бэка
    return new Date(new Date().setFullYear(new Date().getFullYear() + 1));
  }

  isFieldInvalid(field: string) {
    return this.passwordChangeForm.hasError('password_mismatch') && field === 'retypePassword' ||
           this.passwordChangeForm.get(field).errors &&
           this.passwordChangeForm.get(field).dirty;
  }

  submitStateError() {
    return this.loadingState === ClrLoadingState.ERROR;
  }

  submitStateSuccess() {
    return this.loadingState === ClrLoadingState.SUCCESS;
  }
}
