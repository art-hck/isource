import { AbstractControl, ValidationErrors } from "@angular/forms";

export function proposalManufacturerValidator(control: AbstractControl): ValidationErrors | null {
  return control.value.length === control.value
    .filter(pos => pos.manufacturingName).length ? null : {manufacturer_name_error: true};
}
