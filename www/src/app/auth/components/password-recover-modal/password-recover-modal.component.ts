import { Component, OnDestroy, ViewChild } from '@angular/core';
import { ClrLoadingState, ClrModal } from "@clr/angular";
import { AbstractControl, FormControl, FormGroup, Validators } from "@angular/forms";
import { CustomValidators } from "../../../shared/forms/custom.validators";
import { AuthService } from "../../services/auth.service";
import { Subscription } from "rxjs";

@Component({
  selector: 'app-password-recover-modal',
  templateUrl: 'password-recover-modal.component.html'
})
export class PasswordRecoverModalComponent implements OnDestroy {
  @ViewChild(ClrModal, { static: false }) modal: ClrModal;

  loadingState: ClrLoadingState;
  clrLoadingState = ClrLoadingState;
  isLoading: boolean;
  subscription = new Subscription();
  form = new FormGroup({
    email: new FormControl("", [Validators.required, CustomValidators.email])
  });

  get isEmailInvalid() {
    const control: AbstractControl = this.form.get('email');
    return control.hasError('invalid_email') && control.touched && control.dirty;
  }

  constructor(private authService: AuthService) {}

  open() {
    this.modal.open();
  }

  close() {
    this.modal.close();
  }

  submit() {
    if (this.form.invalid) {
      return;
    }
    this.loadingState = ClrLoadingState.LOADING;
    this.subscription.add(
      this.authService.requestPasswordRecover(this.form.get("email").value).subscribe(
        () => this.loadingState = ClrLoadingState.SUCCESS,
        () => this.loadingState = ClrLoadingState.ERROR
      )
    );
  }

  reset() {
    this.loadingState = null;
    this.form.reset();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
