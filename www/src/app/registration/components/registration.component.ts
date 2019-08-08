import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CustomValidators } from "../../shared/forms/custom.validators";
import { UserRegistration } from "../models/user-registration";
import { ContragentRegistration } from "../models/contragent-registration";
import { RegistrationService } from "../services/registration.service";
import { Router } from "@angular/router";
import { DadataConfig, DadataType } from '@kolkov/ngx-dadata';
import Swal from "sweetalert2";
import * as moment from "moment";

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  userRegistrationForm: FormGroup;
  contragentRegistrationForm: FormGroup;
  nextForm = false;
  userRegistration: UserRegistration;
  contragentRegistration: ContragentRegistration;

  autofillAlertShown = false;

  configParty: DadataConfig = {
    apiKey: 'fc06e6b8af300332f72a366ccdd3dad784e773cd',
    type: DadataType.party
  };

  configBank: DadataConfig = {
    apiKey: 'fc06e6b8af300332f72a366ccdd3dad784e773cd',
    type: DadataType.bank
  };

  constructor(
    private formBuilder: FormBuilder,
    private registrationService: RegistrationService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.userRegistrationForm = this.formBuilder.group({
      password: ['', [Validators.required, CustomValidators.password]],
      confirmedPassword: ['', [Validators.required, CustomValidators.passwordConfirming('password')]],
      lastName: ['', [Validators.required, CustomValidators.cyrillicName]],
      firstName: ['', [Validators.required, CustomValidators.cyrillicName]],
      secondName: ['', CustomValidators.cyrillicNotRequired],
      email: ['', [Validators.required, CustomValidators.email]],
      phone: ['', [Validators.required, CustomValidators.phone]],
      agreement: [false, [Validators.required, Validators.requiredTrue]]
    });
    this.contragentRegistrationForm = this.formBuilder.group({
      fullName: ['', [Validators.required, CustomValidators.cyrillic]],
      shortName: ['', [Validators.required, CustomValidators.cyrillic]],
      inn: ['', [Validators.required, CustomValidators.inn]],
      kpp: ['', [Validators.required, CustomValidators.kpp]],
      ogrn: ['', [Validators.required, CustomValidators.ogrn]],
      checkedDate: ['', [Validators.required, CustomValidators.pastDate()]],
      contragentEmail: ['', [Validators.required, CustomValidators.email]],
      contragentPhone: ['', [Validators.required, CustomValidators.phone]],
      country: ['', [Validators.required, CustomValidators.cyrillic]],
      area: ['', [Validators.required, CustomValidators.cyrillic]],
      city: ['', [Validators.required, CustomValidators.cyrillic]],
      index: ['', [Validators.required, CustomValidators.index]],
      town: ['', CustomValidators.cyrillicNotRequired],
      address: ['', [Validators.required, CustomValidators.cyrillic]],
      bankAccount: ['', [Validators.required, CustomValidators.bankAccount]],
      bik: ['', [Validators.required, CustomValidators.bik]],
      corrAccount: ['', [Validators.required, CustomValidators.corrAccount]],
      bankName: ['', [Validators.required]],
      bankAddress: ['', [Validators.required, CustomValidators.cyrillic]],
    });
  }

  isUserFieldValid(field: string) {
    return this.userRegistrationForm.get(field).errors
      && (this.userRegistrationForm.get(field).touched || this.userRegistrationForm.get(field).dirty);
  }

  isContragentFieldValid(field: string) {
    if (this.contragentRegistrationForm.get(field)) {
      return this.contragentRegistrationForm.get(field).errors
        && (this.contragentRegistrationForm.get(field).touched || this.contragentRegistrationForm.get(field).dirty);
    }
  }

  onChangeStep() {
    this.nextForm = !this.nextForm;
  }

  onPartySuggestionSelected(event): void {
    this.autofillAlertShown = true;
    const registrationDate = moment(new Date(event.data.state.registration_date)).format('DD.MM.YYYY');

    const partyFormInfo = {
      fullName: event.data.name.full_with_opf,
      shortName: event.data.name.short_with_opf,
      inn: event.data.inn,
      kpp: event.data.kpp,
      ogrn: event.data.ogrn,
      checkedDate: registrationDate,
      country: event.data.address.data.country,
      area: event.data.address.data.region,
      city: event.data.address.data.city,
      index: event.data.address.data.postal_code,
      town: event.data.address.data.settlement,
      address: event.data.address.value,
    };

    this.contragentRegistrationForm.patchValue(partyFormInfo);

    this.contragentRegistrationForm.markAllAsTouched();
  }

  onBankSuggestionSelected(event): void {
    this.autofillAlertShown = true;

    const bankFormInfo = {
      bik: event.data.bic,
      corrAccount: event.data.correspondent_account,
      bankName: event.data.name.payment,
      bankAddress: event.data.address.value,
    };

    this.contragentRegistrationForm.patchValue(bankFormInfo);

    this.contragentRegistrationForm.markAllAsTouched();
  }

  onRegistration() {
    this.userRegistration = this.userRegistrationForm.value;
    this.contragentRegistration = this.contragentRegistrationForm.value;
    return this.registrationService.registration(this.userRegistration, this.contragentRegistration).subscribe(
      () => {
        Swal.fire({
          width: 500,
          html: '<p class="text-alert">' + 'Регистрация прошла успешно</br></br>' + '</p>' +
            '<button id="submit" class="btn btn-primary">' +
            'ОК' + '</button>',
          showConfirmButton: false,
          onBeforeOpen: () => {
            const content = Swal.getContent();
            const $ = content.querySelector.bind(content);

            const submit = $('#submit');
            submit.addEventListener('click', () => {
              this.router.navigateByUrl(`login`);
              Swal.close();
            });
          }
        });
      },
      (msg: any) => {
        alert('Ошибка регистрации! ' + msg.error.detail);
      }
    );
  }
}
