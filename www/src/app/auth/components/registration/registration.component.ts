import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CustomValidators } from "../../../shared/forms/custom.validators";
import { RegistrationService } from "../../services/registration.service";
import { Router } from "@angular/router";
import { filter, finalize, tap } from "rxjs/operators";
import { ClrModal } from "@clr/angular";
import { RegistrationRequest } from "../../models/registration-request";
import { Subscription } from "rxjs";
import { ContragentService } from "../../../contragent/services/contragent.service";
import { Store } from "@ngxs/store";
import { ToastActions } from "../../../shared/actions/toast.actions";
import { Toast } from "../../../shared/models/toast";

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit, OnDestroy {
  @ViewChild('contragentFound') contragentFound: ClrModal;
  @ViewChild('contragentNotFound') contragentNotFound: ClrModal;
  @ViewChild('successRegister', { static: true }) successRegister: TemplateRef<any>;

  form: FormGroup;
  contragentForm: FormGroup;
  isLoading = false;
  registrationProcessing = false;
  subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private registrationService: RegistrationService,
    private contragentService: ContragentService,
    private router: Router,
    private store: Store
  ) {
  }

  ngOnInit() {
    this.form = this.fb.group({
      password: ['', [Validators.required, CustomValidators.password]],
      confirmedPassword: ['', [Validators.required, CustomValidators.passwordConfirming('password')]],
      lastName: ['', [Validators.required, CustomValidators.cyrillicName]],
      firstName: ['', [Validators.required, CustomValidators.cyrillicName]],
      middleName: ['', CustomValidators.cyrillicNotRequired],
      username: ['', [Validators.required, CustomValidators.email]],
      phone: ['', [Validators.required, CustomValidators.phone]],
      agreement: [false, [Validators.required, Validators.requiredTrue]],
      joinContragent: this.fb.group({
        id: ''
      })
    });

    this.contragentForm = this.fb.group({
      name: '',
      inn: ['', [Validators.required, CustomValidators.inn]],
      kpp: ['', [Validators.required, CustomValidators.kpp]],
    });
  }

  register() {
    if (this.form.invalid) {
      return;
    }

    const body: RegistrationRequest = this.form.value;

    this.registrationProcessing = true;

    this.subscription.add(this.registrationService.registration(body).subscribe(
      () => {
        this.contragentFound.close();
        this.store.dispatch(new ToastActions.Push({ template: this.successRegister }));
        this.router.navigateByUrl(`auth/login`);

        this.registrationProcessing = false;
      },
      msg => {
        alert('Ошибка регистрации! ' + msg.error.detail);
        this.registrationProcessing = false;
      }
    ));
  }

  dismiss(toast: Toast) {
    this.store.dispatch(new ToastActions.Remove(toast));
  }

  submit() {
    const {inn, kpp} = this.contragentForm.value;

    this.form.disable();
    this.isLoading = true;
    this.subscription.add(
      this.contragentService.contragentExists(inn, kpp).pipe(
        tap(contragent => contragent ? this.contragentFound.open() : this.contragentNotFound.open()),
        filter(contragent => !!contragent),
        tap(contragent => this.contragentForm.get('name').setValue(contragent.shortName)),
        tap(contragent => this.form.get('joinContragent').get('id').setValue(contragent.id)),
        finalize(() => {
          this.isLoading = false;
          this.form.enable();
        })
      ).subscribe()
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
