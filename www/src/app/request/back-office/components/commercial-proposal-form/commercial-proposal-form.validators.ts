import { RequestPosition } from "../../../common/models/request-position";
import { AbstractControl, ValidatorFn } from "@angular/forms";
import { CustomValidators } from "../../../../shared/forms/custom.validators";
import * as moment from "moment";

export class CommercialProposalFormValidators {
  static supplierOfferExistsValidator(position?: RequestPosition): ValidatorFn  {
    return (control: AbstractControl) => control.value && position?.linkedOffers
      .some(({ supplierContragentId }) => supplierContragentId === control.value.id) ? { supplierOfferExist: true } : null;
  }

  static quantityValidator(position?: RequestPosition): ValidatorFn  {
    return (control: AbstractControl) => {
      const value = control.value;
      return (!value || value === '' || value >= position.quantity) ? null : { "quantityNotEnough": true };
    };
  }

  static deliveryDateValidator(position?: RequestPosition): ValidatorFn {
    return (control: AbstractControl) => {
      return moment(position.deliveryDate).isBefore(moment(control.value, 'DD.MM.YYYY')) ? { dateIsLaterThanNeeded: true } : null;
    };
  }
}
