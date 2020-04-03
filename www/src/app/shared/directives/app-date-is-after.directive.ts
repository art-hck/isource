import { Directive, Input, OnDestroy } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from "@angular/forms";
import * as moment from "moment";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";

@Directive({
  selector: '[appDateIsAfter]',
  providers: [{ provide: NG_VALIDATORS, useExisting: AppDateIsAfterDirective, multi: true}],
})
export class AppDateIsAfterDirective implements Validator, OnDestroy {
  @Input() appDateIsAfter: string;
  readonly destroy$ = new Subject();

  validate(control: AbstractControl): ValidationErrors {
    const compared = control.parent.get(this.appDateIsAfter);
    compared.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => control.updateValueAndValidity());

    return !compared.value || moment(control.value, "DD.MM.YYYY")
      .isAfter(moment(compared.value, "DD.MM.YYYY")) ? null : {expired : true};
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
