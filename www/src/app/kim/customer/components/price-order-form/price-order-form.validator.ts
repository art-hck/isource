import { AbstractControl } from "@angular/forms";

export class PriceOrderFormValidator {
  static positions({value}: AbstractControl) {
    return (value || []).some(
      p => ["okpd2", "name", "quantity", "okei"].filter(k => !Object.keys(p).includes(k)).length
    ) ? {required: true} : null;
  }
}
