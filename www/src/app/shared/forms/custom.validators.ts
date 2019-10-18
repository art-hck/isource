import { AbstractControl, FormArray, FormControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { Subscription } from "rxjs";
import * as moment from "moment";
import { ContragentList } from "../../contragent/models/contragent-list";

export class CustomValidators {

  static kpp(control: FormControl): any {
    return CustomValidators.nineDigits(control);
  }

  static bik(control: FormControl): any {
    return CustomValidators.nineDigits(control);
  }

  static bankAccount(control: FormControl): any {
    return CustomValidators.twentyDigits(control);
  }

  static corrAccount(control: FormControl): any {
    return CustomValidators.twentyDigits(control);
  }

  static cyrillicNotRequired(control: FormControl): any {
    if (control.value === '') {
      return null;
    }
    return CustomValidators.cyrillic(control);
  }

  // Используется для валидации КПП и БИК
  protected static nineDigits(control: FormControl): any {
    const value = control.value || '';
    const valid = String(value).trim().match(/^\d{9}$/);
    return valid ? null : {field: true};
}

  // Используется для валидации банковского и корреспонденского счета
  static twentyDigits(control: FormControl): any {
    const value = control.value || '';
    const valid = String(value).trim().match(/^\d{20}$/);
    return valid ? null : {field: true};
  }

  static index(control: FormControl): any {
    const value = control.value || '';
    const valid = String(value).trim().match(/^\d{6}$/);
    return valid ? null : {field: true};
  }

  static ogrn(control: FormControl): any {
    const value = control.value || '';
    const valid = String(value).trim().match(/^(\d{13}|\d{15})$/);
    return valid ? null : {field: true};
  }

  static inn(control: FormControl): any {
    const value = control.value || '';
    const valid = String(value).trim().match(/^(\d{10}|\d{12})$/);
    return valid ? null : {field: true};
  }

  // Используется для валидации ФИО, разрешена киррилица, пробелы и тире
  static cyrillicName(control: FormControl): any {
    const value = control.value || '';
    const valid = String(value).trim().match(/^[а-яА-ЯёЁ\s]+$/);
    return valid ? null : {field: true};
  }

  // Используется для валидации наименований организаций,
  // разрешена кириллица, латиница, пробелы, тире, цифры и знаки препинания
  static simpleText(control: FormControl): any {
    const value = control.value || '';
    const valid = String(value).trim().match(/^[?!,№`"-.а-яА-ЯёЁa-zA-Z0-9\s]+$/);
    return valid ? null : {field: true};
  }

  // Используется для валидации адресов,
  // разрешена кириллица, пробелы, тире, цифры и знаки препинания
  static cyrillic(control: FormControl): any {
    const value = control.value || '';
    const valid = String(value).trim().match(/^[?!,"-.а-яА-ЯёЁ0-9\s]+$/);
    return valid ? null : {field: true};
  }

  static email(control: FormControl): any {
    const value = control.value || '';
    const valid = String(value).trim().match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/);
    return valid ? null : {field: true};
  }

  static phone(control: FormControl): any {
    const value = control.value || '';
    const valid = String(value).trim().match(/^\d{10,11}$/);
    return valid ? null : {field: true};
  }

  static password(control: FormControl): any {
    const value = control.value || '';
    const valid = String(value).trim().match(/(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).{8,}/);
    return valid ? null : {field: true};
  }

  static passwordConfirming(controlNameToCompare: string): ValidatorFn {
    return (c: AbstractControl): ValidationErrors | null => {
      if (c.value === null || c.value.length === 0) {
        return null;
      }
      const controlToCompare = c.root.get(controlNameToCompare);
      if (controlToCompare) {
        const subscription: Subscription = controlToCompare.valueChanges.subscribe(() => {
          c.updateValueAndValidity();
          subscription.unsubscribe();
        });
      }
      return controlToCompare && controlToCompare.value !== c.value ? { 'compare': true } : null;
    };
  }

  static customDate(startDate: string): ValidatorFn {
    return (endDate: AbstractControl): ValidationErrors | null => {
      if (endDate.value === null || endDate.value.length === 0) {
        return null;
      }
      const controlToCompare = endDate.root.get(startDate);
      if (controlToCompare) {
        const subscription: Subscription = controlToCompare.valueChanges.subscribe(() => {
          endDate.updateValueAndValidity();
          subscription.unsubscribe();
        });
      }
      const controlDate = moment(endDate.value, 'DD.MM.YYYY');
      const validationDate = moment(controlToCompare.value, 'DD.MM.YYYY');
      return controlDate.isAfter(validationDate) ? null : { 'field': true };
    };
  }

  static pastDate(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const controlDate = moment(control.value, 'DD.MM.YYYY');
      const validationDate = moment(new Date(), 'DD.MM.YYYY');
      return controlDate.isBefore(validationDate) ? null : { 'field': true };
    };
  }

  static futureDate(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const controlDate = moment(control.value, 'DD.MM.YYYY');
      const validationDate = moment(new Date(), 'DD.MM.YYYY');
      return controlDate.isAfter(validationDate) ? null : { 'field': true };
    };
  }

  static multipleCheckboxRequireOne(formArray: FormArray): ValidationErrors {
    return formArray.value
      .filter(value => value)
      .length > 0 ? null : { 'multipleCheckboxRequireOne': true }
    ;
  }

  static validContragent(control: FormControl): ValidationErrors {
    return control.value instanceof ContragentList ? null : { 'invalidContragent': true };
  }
}
