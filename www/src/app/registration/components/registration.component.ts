import { Component, OnInit } from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators} from "@angular/forms";
import {CustomValidators} from "../../shared/forms/custom.validators";
import * as moment from "moment";

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  userRegistrationForm: FormGroup;
  contragentRegistrationForm: FormGroup;
  nextForm: boolean = false;

  constructor(private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.userRegistrationForm = this.formBuilder.group({
      password: ['', [Validators.required, CustomValidators.password]],
      confirmedPassword: ['', [Validators.required, CustomValidators.passwordConfirming('password')]],
      lastName: ['', [Validators.required, CustomValidators.cyrrilicName]],
      firstName: ['', [Validators.required, CustomValidators.cyrrilicName]],
      secondName: ['' [CustomValidators.cyrrilicName]],
      email: ['', [Validators.required, CustomValidators.email]],
      phone: ['', [Validators.required, CustomValidators.phone]],
      agreement: [false, [Validators.required, Validators.requiredTrue]]
    });
    this.contragentRegistrationForm = this.formBuilder.group({
      fullContragentName: ['', [Validators.required, CustomValidators.cyrrilic]],
      contragentName: ['', [Validators.required,CustomValidators.cyrrilic]],
      inn: ['', [Validators.required, CustomValidators.tenDigits]],
      kpp: ['', [Validators.required, CustomValidators.nineDigits]],
      ogrn: ['', [Validators.required, CustomValidators.thirtyDigits]],
      checkedDate: ['', [Validators.required, CustomValidators.pastDate]],
      contragentEmail: ['', [Validators.required, CustomValidators.email]],
      contragentPhone: ['', [Validators.required, CustomValidators.phone]],
      country: ['', [Validators.required, CustomValidators.cyrrilic]],
      area: ['', [Validators.required, CustomValidators.cyrrilic]],
      city: ['', [Validators.required, CustomValidators.cyrrilic]],
      index: ['', [Validators.required, CustomValidators.sixDigits]],
      town: ['', CustomValidators.cyrrilic],
      address: ['', [Validators.required, CustomValidators.cyrrilic]],
      bankAccount: ['', [Validators.required, CustomValidators.twentyDigits]],
      bik: ['', [Validators.required, CustomValidators.nineDigits]],
      corrAccount: ['',[Validators.required, CustomValidators.twentyDigits]],
      bankName: ['', Validators.required, CustomValidators.cyrrilic],
      bankAddress: ['', [Validators.required, CustomValidators.cyrrilic]],
    });
  }

  isUserFieldValid(field: string) {
    return this.userRegistrationForm.get(field).errors
      && (this.userRegistrationForm.get(field).touched || this.userRegistrationForm.get(field).dirty);
  }

  isContragentFieldValid(field: string) {
    return this.contragentRegistrationForm.get(field).errors
      && (this.contragentRegistrationForm.get(field).touched || this.contragentRegistrationForm.get(field).dirty);
  }

  onChangeStep() {
    this.nextForm = !this.nextForm;
  }
}
