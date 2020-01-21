import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CustomValidators } from "../../../shared/forms/custom.validators";
import { RegistrationService } from "../../services/registration.service";
import { Router } from "@angular/router";
import { DadataConfig, DadataType } from '@kolkov/ngx-dadata';
import Swal from "sweetalert2";
import * as moment from "moment";
import { GpnmarketConfigInterface } from "../../../core/config/gpnmarket-config.interface";
import { APP_CONFIG } from '@stdlib-ng/core';
import { filter, finalize, tap } from "rxjs/operators";
import { ClrModal } from "@clr/angular";
import { RegistrationRequest } from "../../models/registration-request";
import { Subscription } from "rxjs";

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit, OnDestroy {
  @ViewChild('contragentFound', { static: false }) contragentFound: ClrModal;
  @ViewChild('contragentNotFound', { static: false }) contragentNotFound: ClrModal;

  userRegistrationForm: FormGroup;
  contragentRegistrationForm: FormGroup;
  contragentJoinForm: FormGroup;
  nextForm = false;
  autofillAlertShown = true;
  isLoading = false;
  configParty: DadataConfig;
  configBank: DadataConfig;
  subscription = new Subscription();

  get disableChangeStep() {
    const contragent = this.contragentRegistrationForm.get('contragent');
    return this.userRegistrationForm.invalid || contragent.get('inn').invalid || contragent.valid;
  }

  constructor(private fb: FormBuilder,
    @Inject(APP_CONFIG) appConfig: GpnmarketConfigInterface,
    private registrationService: RegistrationService,
    private router: Router
  ) {
    this.configParty = {
      apiKey: appConfig.dadata.apiKey,
      type: DadataType.party
    };

    this.configBank = {
      apiKey: appConfig.dadata.apiKey,
      type: DadataType.bank
    };
  }

  ngOnInit() {
    this.userRegistrationForm = this.fb.group({
      password: ['', [Validators.required, CustomValidators.password]],
      confirmedPassword: ['', [Validators.required, CustomValidators.passwordConfirming('password')]],
      lastName: ['', [Validators.required, CustomValidators.cyrillicName]],
      firstName: ['', [Validators.required, CustomValidators.cyrillicName]],
      middleName: ['', CustomValidators.cyrillicNotRequired],
      username: ['', [Validators.required, CustomValidators.email]],
      phone: ['', [Validators.required, CustomValidators.phone]],
      agreement: [false, [Validators.required, Validators.requiredTrue]]
    });

    this.contragentRegistrationForm = this.fb.group({
      contragent: this.fb.group({
        fullName: ['', [Validators.required, CustomValidators.simpleText]],
        shortName: ['', [Validators.required, CustomValidators.simpleText]],
        inn: ['', [Validators.required, CustomValidators.inn]],
        kpp: ['', [Validators.required, CustomValidators.kpp]],
        ogrn: ['', [Validators.required, CustomValidators.ogrn]],
        taxAuthorityRegistrationDate: ['', [Validators.required, CustomValidators.pastDate()]],
        email: ['', [Validators.required, CustomValidators.email]],
        phone: ['', [Validators.required, CustomValidators.phone]],
      }),
      contragentAddress: this.fb.group({
        country: ['', [Validators.required, CustomValidators.cyrillic]],
        region: ['', [Validators.required, CustomValidators.cyrillic]],
        city: ['', [Validators.required, CustomValidators.cyrillic]],
        address: ['', [Validators.required, CustomValidators.simpleText]],
        postIndex: ['', [Validators.required, CustomValidators.index]],
        locality: ['', CustomValidators.cyrillicNotRequired]
      }),
      contragentBankRequisite: this.fb.group({
        account: ['', [Validators.required, CustomValidators.bankAccount]],
        correspondentAccount: ['', [Validators.required, CustomValidators.corrAccount]],
        bik: ['', [Validators.required, CustomValidators.bik]],
        name: ['', [Validators.required]],
        address: ['', [Validators.required]],
      }),
    });

    this.contragentJoinForm = this.fb.group({
      joinContragent: this.fb.group({
        id: ['', Validators.required]
      })
    });
  }

  onChangeStep() {
    if (!this.disableChangeStep) {
      this.contragentNotFound.close();
      this.nextForm = !this.nextForm;
    }
  }

  onPartySuggestionSelected(event): void {
    const data = event.data;
    this.autofillAlertShown = true;
    const registrationDate = data.state.registration_date ?
      moment(new Date(data.state.registration_date)).format('DD.MM.YYYY') : '';

    this.contragentRegistrationForm.get('contragent').patchValue({
      fullName: data.name.full_with_opf || '',
      shortName: data.name.short_with_opf || '',
      inn: data.inn || '',
      kpp: data.kpp || '',
      ogrn: data.ogrn || '',
      taxAuthorityRegistrationDate: registrationDate,
    });

    this.contragentRegistrationForm.get('contragentAddress').patchValue({
      country: data.address.data.country || '',
      region: data.address.data.region || '',
      city: data.address.data.city || '',
      postIndex: data.address.data.postal_code || '',
      locality: data.address.data.settlement || '',
      address: data.address.value || '',
    });

    this.contragentRegistrationForm.markAllAsTouched();
  }

  onBankSuggestionSelected(event): void {
    const data = event.data;
    this.autofillAlertShown = true;

    this.contragentRegistrationForm.get('contragentBankRequisite').patchValue({
      bik: data.bic || '',
      correspondentAccount: data.correspondent_account || '',
      name: data.name.payment || '',
      address: data.address.value || '',
    });

    this.contragentRegistrationForm.markAllAsTouched();
  }

  onRegistration() {
    if (this.userRegistrationForm.invalid) {
      return;
    }

    let body: RegistrationRequest = this.userRegistrationForm.value;

    if (this.contragentJoinForm.valid) {
      body = { ...body, ...this.contragentJoinForm.value };
    } else if (this.contragentRegistrationForm.valid) {
      body = { ...body, ...this.contragentRegistrationForm.value };
    } else {
      return;
    }

    this.subscription.add(this.registrationService.registration(body).subscribe(
      () => {
        this.contragentFound.close();
        this.router.navigateByUrl(`auth/login`);
        Swal.fire({
          width: 500,
          html: `<p class="text-alert">Регистрация прошла успешно.</br></br>
            На Вашу почту отправлено письмо со ссылкой для активации учётной записи.</br></br></p>
            <button id="submit" class="btn btn-primary">ОК</button>`,
          showConfirmButton: false,
          onBeforeOpen: () => Swal.getContent().querySelector('#submit').addEventListener('click', () => Swal.close())
        });
      },
      msg => alert('Ошибка регистрации! ' + msg.error.detail)
    ));
  }

  userFormSubmit() {
    const {inn, kpp} = this.contragentRegistrationForm.get('contragent').value;

    this.userRegistrationForm.disable();
    this.isLoading = true;
    this.subscription.add(
      this.registrationService.contragentExists(inn, kpp).pipe(
        tap(contragent => contragent ? this.contragentFound.open() : this.contragentNotFound.open()),
        filter(contragent => !!contragent),
        tap(contragent => this.contragentJoinForm.get('joinContragent').get('id').setValue(contragent.id)),
        finalize(() => {
          this.isLoading = false;
          this.userRegistrationForm.enable();
        })
      ).subscribe()
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
