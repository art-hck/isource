import {AbstractControl, FormControl, ValidationErrors, ValidatorFn} from "@angular/forms";
import {Subscription} from "rxjs";
import * as moment from "moment";

export class CustomValidators {

  // Используется для валидации КПП и БИК
  static nineDigits(control: FormControl): any {
    const value = control.value || '';
    const valid = String(value).match(/^\d{9}$/);
    return valid ? null : {field: true};
}

  static tenDigits(control: FormControl): any {
    const value = control.value || '';
    const valid = String(value).match(/^(\d{10}|\d{12})$/);
    return valid ? null : {field: true};
  }

// Используется для валидации почтового индекса
  static sixDigits(control: FormControl): any {
    const value = control.value || '';
    const valid = String(value).match(/^\d{6}$/);
    return valid ? null : {field: true};
  }

  // Используется для валидации банковского и корреспонденского счета
  static twentyDigits(control: FormControl): any {
    const value = control.value || '';
    const valid = String(value).match(/^\d{20}$/);
    return valid ? null : {field: true};
  }

  // Используется для валидации ОГРН
  static thirtyDigits(control: FormControl): any {
    const value = control.value || '';
    const valid = String(value).match(/^\d{13}$/);
    return valid ? null : {field: true};
  }

  // Используется для валидации ФИО, разрешена киррилица, пробелы и тире
  static cyrrilicName(control: FormControl): any {
    const value = control.value || '';
    const valid = String(value).match(/^[а-яА-ЯёЁ\s]+$/);
    return valid ? null : {field: true};
  }

  // Используется для валидации наименований организаций и адресов, разрешена кириллица, пробелы, тире и знаки припинания
  static cyrrilic(control: FormControl): any {
    const value = control.value || '';
    const valid = String(value).match(/^[?!,"-.а-яА-ЯёЁ\s]+$/);
    return valid ? null : {field: true};
  }

  static email(control: FormControl): any {
    const value = control.value || '';
    const valid = String(value).match(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/);
    return valid ? null : {field: true};
  }

  static phone(control: FormControl): any {
    const value = control.value || '';
    const valid = String(value).match(/^\d{10,11}$/);
    return valid ? null : {field: true};
  }

  static password(control: FormControl): any {
    const value = control.value || '';
    const valid = String(value).match(/(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).{8,}/);
    return valid ? null : {field: true};
  }

  static passwordConfirming(controlNameToCompare: string): ValidatorFn {
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

  static pastDate(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const controlDate = moment(control.value, 'DD.MM.YYYY');
      const validationDate = moment(new Date(), 'DD.MM.YYYY');

      return controlDate.isBefore(validationDate) ? null : { 'field': true };
    };
  }

}
