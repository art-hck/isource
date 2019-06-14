import { Component, OnInit } from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators} from "@angular/forms";

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  userForm: FormGroup;
  item: boolean = false;

  constructor(private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    // this.registrationForm = this.formBuilder.group({
    //   login: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(15)]],
    //   passwords: this.formBuilder.group({
    //     password: ['', [Validators.required]],
    //     confirmedPassword: ['', [Validators.required]],
    //   }, {validator: this.passwordConfirming}),
    //   quantity: [null, [Validators.required, Validators.pattern(/^[+]?[1-9]\d*$/)]],
    //   fio: [''],
    //   deliveryBasis: ['', [Validators.required]],
    //
    // });
    this.userForm = this.formBuilder.group({
      passwords: this.formBuilder.group({
        password: ['', [Validators.required]],
        confirmedPassword: ['', [Validators.required]],
      }, {validator: this.passwordConfirming}),

    });
  }

  isFieldValid(field: string) {
    return this.userForm.get(field).errors
      && (this.userForm.get(field).touched || this.userForm.get(field).dirty);
    console.log(this.userForm.get(field).errors
      && (this.userForm.get(field).touched || this.userForm.get(field).dirty));
  }

  passwordConfirming(c: AbstractControl): { invalid: boolean } {
    if (c.get('password').value !== c.get('confirmedPassword').value) {
      return {invalid: true};
    }
  }

//   passwordConfirming(): ValidatorFn {
//     return (c: AbstractControl): ValidationErrors | null => {
//     return (c.get('password').value !== c.get('confirmedPassword').value) ? null : {
//       invalid: true
//     }
//   }
// }

}
