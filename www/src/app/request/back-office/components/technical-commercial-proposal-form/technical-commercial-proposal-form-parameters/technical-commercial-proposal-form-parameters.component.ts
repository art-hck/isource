import { AfterContentInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, forwardRef, Output } from '@angular/core';
import { ControlValueAccessor, FormArray, FormBuilder, NG_VALUE_ACCESSOR, Validators } from "@angular/forms";
import { TechnicalCommercialProposalPosition } from "../../../../common/models/technical-commercial-proposal-position";
import { shareReplay } from "rxjs/operators";
import { OkeiService } from "../../../../../shared/services/okei.service";
import { Okei } from "../../../../../shared/models/okei";
import { CustomValidators } from "../../../../../shared/forms/custom.validators";
import { DatePipe } from "@angular/common";
import { CurrencyLabels } from "../../../../common/dictionaries/currency-labels";
import { PositionCurrency } from "../../../../common/enum/position-currency";

@Component({
  selector: 'app-technical-commercial-proposal-form-parameters',
  templateUrl: './technical-commercial-proposal-form-parameters.component.html',
  styleUrls: ['./technical-commercial-proposal-form-parameters.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    DatePipe,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TechnicalCommercialProposalFormParametersComponent),
      multi: true
    }
  ]
})
export class TechnicalCommercialProposalFormParametersComponent implements AfterContentInit, ControlValueAccessor {
  @Output() cancel = new EventEmitter();
  onTouched: (value) => void;
  onChange: (value) => void;
  value: TechnicalCommercialProposalPosition[];
  formArray: FormArray;
  readonly okeiList$ = this.okeiService.getOkeiList().pipe(shareReplay(1));
  readonly currencies = Object.entries(CurrencyLabels);

  constructor(
    private cd: ChangeDetectorRef,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private okeiService: OkeiService
  ) {
  }

  ngAfterContentInit() {
    this.formArray = this.fb.array(
      this.value.map((p, index) => {
        const form = this.fb.group({
          index: [index],
          name: [p.position.name, Validators.required],
          priceWithVat: [p.priceWithVat, Validators.required],
          quantity: [p.quantity, Validators.required],
          measureUnit: [p.measureUnit, Validators.required],
          currency: [p.currency || PositionCurrency.RUB, Validators.required],
          deliveryDate: [this.parseDate(p.deliveryDate), CustomValidators.futureDate()],
        });
        // @TODO Временное отключение валют
        form.get('currency').disable();
        return form;
      })
    );
    this.cd.detectChanges();
  }

  submit() {
    const value = this.value
      .map((item, i) => ({...item, ...this.formArray.getRawValue().find(_item => _item.index === i)}))
      .map(item => {
        const deliveryDate = (new Date(item.deliveryDate.replace(/(\d{2}).(\d{2}).(\d{4})/, '$3-$2-$1'))).toISOString();
        return { ...item, deliveryDate};
      });

    this.writeValue(value);

    if (this.onChange) {
      this.onChange(value);
    }
  }

  searchOkei(query, okei: Okei[]) {
    return okei.filter(({name, symbol}) => name.toLowerCase().indexOf(query.toLowerCase()) >= 0 ||
      (symbol && symbol.toLowerCase().indexOf(query.toLowerCase()) >= 0)
    ).slice(0, 5);
  }

  registerOnChange = fn => this.onChange = fn;
  registerOnTouched = fn => this.onTouched = fn;
  writeValue = value => this.value = value;

  private parseDate(date: string) {
    if (!date) { return null; }

    try {
      return this.datePipe.transform(new Date(date), 'dd.MM.yyyy');
    } catch (e) {
      return date;
    }
  }
}
