import { Component, OnInit } from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators} from "@angular/forms";
import {Subscription} from "rxjs";

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
      password: ['', [Validators.required, Validators.pattern('(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).{8,}')]],
      confirmedPassword: ['', [Validators.required, this.passwordConfirming('password')]],
      lastName: ['', [Validators.required, Validators.pattern('^[а-яА-ЯёЁ\\s]+$')]],
      firstName: ['', [Validators.required, Validators.pattern('^[а-яА-ЯёЁ\\s]+$')]],
      secondName: ['' [Validators.pattern('^[а-яА-ЯёЁ\\s]+$')]],
      email: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      phone: ['', [Validators.required, Validators.pattern('[0-9]{10,11}')]],
      agreement: [false, [Validators.required, Validators.requiredTrue]]
    });
    this.contragentRegistrationForm = this.formBuilder.group({
      fullContragentName: ['', [Validators.required, Validators.pattern('^[?!,".а-яА-ЯёЁ-\\s]+$')]],
      contragentName: ['', [Validators.required, Validators.pattern('^[?!,".а-яА-ЯёЁ-\\s]+$')]],
      inn: ['', [Validators.required, Validators.pattern('[0-9]{10}')]],
      kpp: ['', [Validators.required, Validators.pattern('[0-9]{9}')]],
      ogrn: ['', [Validators.required, Validators.pattern('[0-9]{13}')]],
      checkedDate: ['', [Validators.required]],
      contragentEmail: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      contragentPhone: ['', Validators.pattern('[0-9]{10,11}')],
      country: ['', [Validators.required, Validators.pattern('^[а-яА-ЯёЁ-\\s]+$')]],
      area: ['', [Validators.required, Validators.pattern('^[а-яА-ЯёЁ-\\s]+$')]],
      city: ['', [Validators.required, Validators.pattern('^[а-яА-ЯёЁ-\\s]+$')]],
      index: ['', [Validators.required, Validators.pattern('[0-9]{6}')]],
      town: ['', Validators.pattern('^[а-яА-ЯёЁ\\s]+$')],
      address: ['', [Validators.required, Validators.pattern('^[?!,.а-яА-ЯёЁ-\\s]+$')]],
      bankAccount: ['', [Validators.required, Validators.pattern('[0-9]{20}')]],
      bik: ['', [Validators.required, Validators.pattern('[0-9]{9}')]],
      corrAccount: ['', Validators.required, Validators.pattern('[0-9]{20}')],
      bankName: ['', Validators.required, Validators.pattern('^[?!,.а-яА-ЯёЁ-\\s]+$')],
      bankAddress: ['', [Validators.required, Validators.pattern('^[?!,.?!,.а-яА-ЯёЁ-\\s]+$')]],
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

  passwordConfirming(controlNameToCompare: string): ValidatorFn {
    return (c: AbstractControl): ValidationErrors | null => {
    if (c.value === null || c.value.length === 0) {
      return null;
    }
    const controlToCompare = c.root.get(controlNameToCompare);
    if (controlToCompare) {
      const subscription: Subscription = controlToCompare.valueChanges.subscribe(()=> {
        c.updateValueAndValidity();
        subscription.unsubscribe();
      });
    }
      return controlToCompare && controlToCompare.value !== c.value ? { 'compare': true } : null;
  }
}

  onChangeStep() {
    this.nextForm = !this.nextForm;
  }
}
