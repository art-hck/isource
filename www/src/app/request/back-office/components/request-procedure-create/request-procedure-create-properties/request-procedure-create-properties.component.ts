import { AfterContentInit, Component, forwardRef, OnInit } from '@angular/core';
import { ControlValueAccessor, FormBuilder, FormGroup, NG_VALUE_ACCESSOR } from "@angular/forms";

@Component({
  selector: 'app-request-procedure-create-properties',
  templateUrl: './request-procedure-create-properties.component.html',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => RequestProcedureCreatePropertiesComponent),
    multi: true
  }]
})
export class RequestProcedureCreatePropertiesComponent implements OnInit, AfterContentInit, ControlValueAccessor {
  public onTouched: (value) => void;
  public onChange: (value) => void;
  public form: FormGroup;
  public value;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.form = this.fb.group({
      manualEndRegistration: false, // Досрочное завершение приема заявок на участие
      positionsRequiredAll: false, // Обязательная подача предложений на все позиции
      positionsAnalogs: false, // Разрешается прием аналогов
      positionsAllowAnalogsOnly: false, // Возможность подачи аналогов без основного предложения
      positionsEntireVolume: false, // Заявка подается на весь закупаемый объем
      positionsSuppliersVisibility: 'NameHidden', // Отображение наименований участников
      positionsBestPriceType: 'LowerStartPrice', // Ограничение на подачу цен
      positionsApplicsVisibility: 'PriceAndRating', // Отображение цен
      publicAccess: true // Доступ к процедуре
    });

  }

  ngAfterContentInit() {
    this.writeValue(this.form.value);
    this.onChange(this.form.value);

    this.form.valueChanges.subscribe(value => {
      this.writeValue(value);
      this.onChange(this.form.value);
    });
  }

  registerOnChange(fn: any): void { this.onChange = fn; }
  registerOnTouched(fn: any): void { this.onTouched = fn; }
  writeValue(value): void { this.value = value; }
}
