import { AbstractControl, ValidationErrors } from "@angular/forms";

export function proposalManufacturerValidator(control: AbstractControl, full = true): ValidationErrors | null {
  return (full ? control.value.length : 0) === control.value
    .filter(pos => pos.manufacturingName).length ? null : { manufacturer_name_error: true };
}
