import { ChangeDetectionStrategy, Component, EventEmitter, forwardRef, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DatePipe } from "@angular/common";
import { ControlValueAccessor, FormBuilder, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validator, Validators } from "@angular/forms";
import { debounceTime, filter, flatMap, map, shareReplay, startWith, tap } from "rxjs/operators";
import { merge, Observable, of, Subject, Subscription } from "rxjs";
import { RequestPositionService } from "../../services/request-position.service";
import { CustomValidators } from "../../../../shared/forms/custom.validators";
import { PositionCurrency } from "../../enum/position-currency";
import { RequestPosition } from "../../models/request-position";
import { RequestPositionStatusService } from "../../services/request-position-status.service";
import { PositionStatus as PositionStatuses } from "../../enum/position-status";
import { Uuid } from "../../../../cart/models/uuid";
import { UserInfoService } from "../../../../user/service/user-info.service";
import { NormPositionService } from "../../../../shared/services/norm-position.service";
import * as moment from 'moment';
import { UxgDropdownInputComponent, UxgModalComponent, UxgPopoverComponent } from "uxg";
import { OkeiService } from "../../../../shared/services/okei.service";
import { Okei } from "../../../../shared/models/okei";
import { CurrencyLabels } from "../../dictionaries/currency-labels";
import { Store } from "@ngxs/store";

@Component({
  selector: 'app-request-position-form',
  templateUrl: './position-form.component.html',
  styleUrls: ['./position-form.component.scss'],
  providers: [
    DatePipe,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PositionFormComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => PositionFormComponent),
      multi: true,
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class PositionFormComponent implements OnInit, ControlValueAccessor, Validator  {
  @Input() requestId: Uuid;
  @Input() position: RequestPosition = new RequestPosition();
  @Input() onDrafted: (position: RequestPosition) => Observable<RequestPosition>;
  @Input() isNewRequest = false;
  @Output() cancel = new EventEmitter();
  @Output() positionChange = new EventEmitter<RequestPosition>();
  @ViewChild('nameRef') nameDropdownInputRef: UxgDropdownInputComponent;
  @ViewChild('quantityPopover') quantityPopover: UxgPopoverComponent;
  form: FormGroup;
  subscription = new Subscription();
  okeiList$: Observable<Okei[]>;
  onTouched: (value) => void;
  onChange: (value) => void;
  value;
  quantityRecommendation: number;
  recommendedUnit: string;

  readonly currencies = Object.entries(CurrencyLabels);

  readonly approveRequiredFields = [
    'name', 'currency', 'deliveryDate', 'isDeliveryDateAsap', 'measureUnit', 'productionDocument'
  ];

  get isDraft(): boolean {
    return this.approveRequiredFields
      .some(controlName => !this.form.get(controlName).pristine || this.form.get(controlName).dirty) || !this.position;
  }

  get needApprove(): boolean {
    return (this.isDraft || !this.position.id) && !!this.onDrafted;
  }

  constructor(
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private statusService: RequestPositionStatusService,
    private positionService: RequestPositionService,
    public okeiService: OkeiService,
    private store: Store
  ) {}

  ngOnInit() {
    const p = this.position;
    const form = this.formBuilder.group({
      name: [p?.name, Validators.required],
      comments: [p?.comments],
      currency: [p?.currency, Validators.required],
      deliveryBasis: [p?.deliveryBasis, Validators.required],
      deliveryDate: [this.datePipe.transform(p?.deliveryDate, 'dd.MM.yyyy'), CustomValidators.futureDate()],
      isDeliveryDateAsap: [p?.isDeliveryDateAsap],
      isDesignRequired: [p?.isDesignRequired],
      isInspectionControlRequired: [p?.isInspectionControlRequired || false],
      isPnrRequired: [p?.isPnrRequired || false],
      isShmrRequired: [p?.isShmrRequired || false],
      measureUnit: [p?.measureUnit, Validators.required],
      paymentTerms: [p?.paymentTerms || '30 дней по факту поставки', Validators.required],
      productionDocument: [p?.productionDocument, Validators.required],
      quantity: [p?.quantity, [Validators.required, Validators.pattern("^[.0-9]+$"), Validators.min(0.0001)]],
      startPrice: [p?.startPrice, [Validators.pattern("^[0-9]+$"), Validators.min(1)]],
      documents: [[]]
    });

    if (this.position?.id) {
      Object.keys(form.controls).filter(key => !this.position.availableEditFields.includes(key)).forEach(key => form.get(key).disable());
    }

    form.get('isDeliveryDateAsap').valueChanges
      .pipe(
        startWith(<{}>form.get('isDeliveryDateAsap').value),
        filter(() => form.get('isDeliveryDateAsap').enabled)
      )
      .subscribe(checked => {
        if (checked) {
          form.get('deliveryDate').reset();
          form.get('deliveryDate').disable();
        } else {
          form.get('deliveryDate').enable();
        }
      });

    // @TODO Временное отключение валют
    form.get('currency').setValue(PositionCurrency.RUB);
    form.get('currency').disable();

    this.form = form;
    this.form.valueChanges.pipe(startWith(<{}>this.form.value)).subscribe(value => {
      this.writeValue(value);
      if (this.onChange) {
        this.onChange(value);
      }
    });
    this.okeiList$ = this.okeiService.getOkeiList().pipe(shareReplay(1));
  }

  submit() {
    if (this.form.invalid) {
      return;
    } else {
      let submit$: Observable<RequestPosition>;

      if (this.position.id) {
        // Проверяем, есть ли правки для сохранения или данные в форме остались без изменений
        const positionInfoNotChanged = Object.entries(this.form.value).every(([key, value]) => {
          let positionInfo = this.position[key] === null ? this.position[key] : this.position[key].toString();
          const updatedInfo = value === null ? value : value.toString();

          if (key === 'deliveryDate') {
            positionInfo = moment(new Date(this.position[key])).format('DD.MM.YYYY');
          }
          return positionInfo === updatedInfo;
        });

        // Если изменений нет, эмитим событие для закрытия окна и прерываем сабмит
        if (positionInfoNotChanged) {
          this.cancel.emit();
          return;
        }

        submit$ = this.positionService.updatePosition(this.position.id, this.form.value);
      } else {
        submit$ = this.positionService.addPosition(this.requestId, [this.form.value])
          .pipe(map(positions => positions[0]));
      }

      submit$ = submit$.pipe(
        flatMap(position =>
          position.status === PositionStatuses.DRAFT && this.onDrafted ? this.onDrafted(position) : of(position)
        ));

      this.form.disable();
      this.subscription.add(submit$.subscribe(position => {
        this.positionChange.emit(position);
        this.position = position;
        this.form.enable();
      }));
    }
  }

  getQuantityRecommendation(positionName: string) {
    this.positionService.getQuantityRecommendation(positionName).subscribe(
      (data) => {
        if (data.length !== 0) {
          this.quantityRecommendation = data[0].forecastCommodity.filter(
            item => item.isForecast === true).reduce(
            (acc, curr) => acc.quantity > curr.quantity ? acc : curr).quantity;
          this.recommendedUnit = data[0].unit;
          this.quantityPopover.show();
        }
      });
  }

  setRecommendedQuantity() {
    this.form.get('quantity').setValue(this.quantityRecommendation);
  }

  filterEnteredText(event: KeyboardEvent): boolean {
    return event.key !== "-" && event.key !== "+";
  }

  registerOnChange = (fn: any) => this.onChange = fn;
  registerOnTouched = (fn: any) => this.onTouched = fn;
  writeValue = (value) => this.value = value;
  validate = () => this.form.invalid ? {invalid: true} : null;
}
