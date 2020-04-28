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
import { UxgDropdownInputComponent } from "uxg";
import { OkeiService } from "../../../../shared/services/okei.service";
import { Okei } from "../../../../shared/models/okei";
import { CurrencyLabels } from "../../dictionaries/currency-labels";
import { Store } from "@ngxs/store";
import { RequestActions } from "../../../back-office/actions/request.actions";

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
  form: FormGroup;
  subscription = new Subscription();
  searchNameSuggestions$: Observable<string[]>;
  onFocusNameSubject$ = new Subject();
  okeiList$: Observable<Okei[]>;
  searchNameSuggestionsComplete: boolean;
  onTouched: (value) => void;
  onChange: (value) => void;
  value;

  readonly currencies = Object.entries(CurrencyLabels);

  readonly approveRequiredFields = [
    'name', 'currency', 'deliveryDate', 'isDeliveryDateAsap', 'measureUnit', 'productionDocument'
  ];
  readonly disabledFieldsAfterStatus = {
    // Вырубаем поля после Согласования ТП/Согласования ТКП
    [PositionStatuses.TECHNICAL_COMMERCIAL_PROPOSALS_AGREEMENT]:
      ['name', 'currency', 'deliveryDate', 'isDeliveryDateAsap', 'measureUnit', 'productionDocument'],

    // Вырубаем «ПНР» и стоимость после подготовки КП
    [PositionStatuses.PROPOSALS_PREPARATION]:
      ['isShmrRequired', 'isPnrRequired', 'startPrice'],

    // Вырубаем «Условия оплаты» после выбора победителя (начиная с «Выбран победитель»)
    [PositionStatuses.WINNER_SELECTED]:
      ['paymentTerms', 'deliveryBasis', 'quantity'],

    // Вырубаем «Инспекционный контроль» после подписания договора
    [PositionStatuses.CONTRACT_SIGNING]:
      ['isInspectionControlRequired'],

    // Вырубаем «РКД» после «РКД согласовано»
    [PositionStatuses.RKD_APPROVED]:
      ['isDesignRequired']
  };

  get isDraft(): boolean {
    return this.approveRequiredFields
      .some(controlName => !this.form.get(controlName).pristine || this.form.get(controlName).dirty) || !this.position;
  }

  get needApprove(): boolean {
    return (this.isDraft || !this.position.id) && !!this.onDrafted;
  }

  get suggestLabel() {
    if (this.form.get('name').value && this.position.nameTemplate) {
      const i = this.form.get('name').value.trim().split(' ').length;
      const arr1 = this.position.nameTemplate.match(/^.*?\[/g)[0].slice(0, -2).split(" ");
      const arr2 = this.position.nameTemplate.match(/\[.*?]/g);
      if (i >= arr1.length) {
        const label = [...arr1, ...arr2][i];
        return label && label.slice(1, -1);
      }
    }
  }

  constructor(
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private statusService: RequestPositionStatusService,
    private positionService: RequestPositionService,
    private userInfoService: UserInfoService,
    private normPositionService: NormPositionService,
    public okeiService: OkeiService,
    private store: Store
  ) {}

  ngOnInit() {
    const p = this.position;
    const form = this.formBuilder.group({
      name: [p.name, Validators.required],
      comments: [p.comments],
      currency: [p.currency, Validators.required],
      deliveryBasis: [p.deliveryBasis, Validators.required],
      deliveryDate: [this.datePipe.transform(p.deliveryDate, 'dd.MM.yyyy'), CustomValidators.futureDate()],
      isDeliveryDateAsap: [p.isDeliveryDateAsap],
      isDesignRequired: [p.isDesignRequired],
      isInspectionControlRequired: [p.isInspectionControlRequired],
      isPnrRequired: [p.isPnrRequired],
      isShmrRequired: [p.isShmrRequired],
      measureUnit: [p.measureUnit, Validators.required],
      paymentTerms: [p.paymentTerms || '30 дней по факту поставки', Validators.required],
      productionDocument: [p.productionDocument, Validators.required],
      quantity: [p.quantity, [Validators.required, Validators.pattern("^[0-9]+$"), Validators.min(1)]],
      startPrice: [p.startPrice, [Validators.pattern("^[0-9]+$"), Validators.min(1)]],
      documents: [[]]
    });

    Object.entries(this.disabledFieldsAfterStatus)
      .filter(([status]) =>
        !this.statusService.isStatusPrevious(this.position.status, status as PositionStatuses))
      .forEach(([status, controlNames]) =>
        controlNames.forEach(controlName => form.get(controlName).disable()));

    this.searchNameSuggestions$ = merge(
      form.get('name').valueChanges,
      this.onFocusNameSubject$
    ).pipe(
      debounceTime(300),
      filter(value => value && value.length > 0),
      flatMap(value => this.normPositionService.searchSuggestions(value)),
      tap(suggestions => this.searchNameSuggestionsComplete = suggestions.length > 0),
    );

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

    if (!this.userInfoService.isCustomer()) {
      form.get('comments').disable();
    }

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

  registerOnChange = (fn: any) => this.onChange = fn;
  registerOnTouched = (fn: any) => this.onTouched = fn;
  writeValue = (value) => this.value = value;
  validate = () => this.form.invalid ? {invalid: true} : null;
}
