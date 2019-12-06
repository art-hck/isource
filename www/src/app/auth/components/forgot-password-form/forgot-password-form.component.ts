import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CustomValidators } from "../../../shared/forms/custom.validators";
import { Router } from "@angular/router";
import { ClrLoadingState } from "@clr/angular";
import { Subscription } from "rxjs";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: 'app-forgot-password-form',
  templateUrl: './forgot-password-form.component.html',
  styleUrls: ['./forgot-password-form.component.scss']
})
export class ForgotPasswordFormComponent implements OnDestroy {

  passwordRestoreForm: FormGroup;

  loadingState = <ClrLoadingState>0;
  clrLoadingState = ClrLoadingState;
  subscription = new Subscription();

  constructor(
    public router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {
    this.passwordRestoreForm = this.formBuilder.group({
      'email': ['', [Validators.required, CustomValidators.email]]
    });
  }


  isFieldInvalid(field: string) {
    return this.passwordRestoreForm.get(field).errors && this.passwordRestoreForm.get(field).dirty;
  }

  getErrorMsg(field: string) {
    if (field === 'email') {
      if (this.isFieldInvalid(field) && this.passwordRestoreForm.controls.email.errors.required) {
        return 'Необходимо заполнить эл. почту';
      }
      if (this.isFieldInvalid(field) && this.passwordRestoreForm.controls.email.errors.invalid_email) {
        return 'Пожалуйста, проверьте корректность введённой эл. почты';
      }
    }

    return '';
  }

  submit() {
    if (this.passwordRestoreForm.invalid) {
      return;
    }
    this.loadingState = ClrLoadingState.LOADING;
    this.subscription.add(
      this.authService.requestPasswordRecover(this.passwordRestoreForm.get('email').value).subscribe(
        () => this.loadingState = ClrLoadingState.SUCCESS,
        () => this.loadingState = ClrLoadingState.ERROR
      )
    );
  }


  submitStateError() {
    return this.loadingState === ClrLoadingState.ERROR;
  }

  submitStateSuccess() {
    return this.loadingState === ClrLoadingState.SUCCESS;
  }


  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
