import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CustomValidators} from "../../shared/forms/custom.validators";
import {UserRegistration} from "../models/user-registration";
import {ContragentRegistration} from "../models/contragent-registration";
import {RegistrationService} from "../services/registration.service";
import {Router} from "@angular/router";

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
      lastName: ['', [Validators.required, CustomValidators.cyrrilicName]],
      firstName: ['', [Validators.required, CustomValidators.cyrrilicName]],
      secondName: [''],
      email: ['', [Validators.required, CustomValidators.email]],
      phone: ['', [Validators.required, CustomValidators.phone]],
      agreement: [false, [Validators.required, Validators.requiredTrue]]
    });
    this.contragentRegistrationForm = this.formBuilder.group({
      fullName: ['', [Validators.required, CustomValidators.cyrrilic]],
      shortName: ['', [Validators.required, CustomValidators.cyrrilic]],
      inn: ['', [Validators.required, CustomValidators.inn]],
      kpp: ['', [Validators.required, CustomValidators.kpp]],
      ogrn: ['', [Validators.required, CustomValidators.ogrn]],
      checkedDate: ['', [Validators.required, CustomValidators.pastDate]],
      contragentEmail: ['', [Validators.required, CustomValidators.email]],
      contragentPhone: ['', [Validators.required, CustomValidators.phone]],
      country: ['', [Validators.required, CustomValidators.cyrrilic]],
      area: ['', [Validators.required, CustomValidators.cyrrilic]],
      city: ['', [Validators.required, CustomValidators.cyrrilic]],
      index: ['', [Validators.required, CustomValidators.index]],
      town: [''],
      address: ['', [Validators.required, CustomValidators.cyrrilic]],
      bankAccount: ['', [Validators.required, CustomValidators.bankAccount]],
      bik: ['', [Validators.required, CustomValidators.kpp]],
      corrAccount: ['', [Validators.required, CustomValidators.corrAccount]],
      bankName: ['', [Validators.required, CustomValidators.cyrrilic]],
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

  onRegistration() {
    this.userRegistration = this.userRegistrationForm.value;
    this.contragentRegistration = this.contragentRegistrationForm.value;
    return this.registrationService.registration(this.userRegistration, this.contragentRegistration).subscribe(
      () => {
        this.router.navigateByUrl(`login`);
      }
    );
  }
}
