import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DatePipe } from "@angular/common";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { flatMap, map } from "rxjs/operators";
import { Observable, of, Subscription } from "rxjs";
import { CreateRequestService } from "../../services/create-request.service";
import { CustomValidators } from "../../../../shared/forms/custom.validators";
import { EditRequestService } from "../../services/edit-request.service";
import { PositionCurrency } from "../../enum/position-currency";
import { RequestPosition } from "../../models/request-position";
import { RequestPositionStatusService } from "../../services/request-position-status.service";
import { RequestPositionWorkflowSteps as PositionStatuses } from "../../enum/request-position-workflow-steps";
import { Uuid } from "../../../../cart/models/uuid";
import { UserInfoService } from "../../../../user/service/user-info.service";
import * as moment from 'moment';

@Component({
  selector: 'app-request-position-form',
  templateUrl: './request-position-form.component.html',
  styleUrls: ['./request-position-form.component.scss'],
  providers: [DatePipe]
})

export class RequestPositionFormComponent implements OnInit {
  @Input() requestId: Uuid;
  @Input() position: RequestPosition = new RequestPosition();
  @Input() onDrafted: (position: RequestPosition) => Observable<RequestPosition>;
  @Output() cancel = new EventEmitter();
  @Output() positionChange = new EventEmitter<RequestPosition>();
  form: FormGroup;
  subscription = new Subscription();

  readonly currencies = [
    { value: PositionCurrency.RUB, label: "Руб." },
    { value: PositionCurrency.USD, label: "Дол." },
    { value: PositionCurrency.EUR, label: "Евр." },
    { value: PositionCurrency.CHF, label: "Фр." },
  ];

  readonly approveRequiredFields = [
    'name', 'currency', 'deliveryDate', 'isDeliveryDateAsap', 'measureUnit', 'productionDocument'
  ];
  readonly disabledFieldsAfterStatus = {
    // Вырубаем поля после Согласования ТП
    [PositionStatuses.TECHNICAL_PROPOSALS_AGREEMENT]:
      ['name', 'currency', 'deliveryDate', 'isDeliveryDateAsap', 'measureUnit', 'productionDocument', 'startPrice'],

    // Вырубаем «ПНР» после подготвки КП
    [PositionStatuses.PROPOSALS_PREPARATION]:
      ['isShmrRequired', 'isPnrRequired'],

    // Вырубаем «Условия оплаты» после выбора победителя (начиная с «Выбран победитель»)
    [PositionStatuses.WINNER_SELECTED]:
      ['paymentTerms'],

    // Вырубаем «Инспекционный контроль» после подписания договора
    [PositionStatuses.CONTRACT_SIGNING]:
      ['isInspectionControlRequired'],

    // Вырубаем «РКД» после изготовления
    [PositionStatuses.MANUFACTURING]:
      ['isDesignRequired']
  };

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
    private createRequestService: CreateRequestService,
    private editRequestService: EditRequestService,
    private userInfoService: UserInfoService
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
      startPrice: [p.startPrice, [Validators.pattern("^[0-9]+$"), Validators.min(1)]]
    });

    Object.entries(this.disabledFieldsAfterStatus)
      .filter(([status, controlNames]) =>
        !this.statusService.isStatusPrevious(this.position.status, status as PositionStatuses))
      .forEach(([status, controlNames]) =>
        controlNames.forEach(controlName => form.get(controlName).disable()));

    form.get('isDeliveryDateAsap').valueChanges.subscribe(checked => {
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

      submit$ = this.editRequestService.updateRequestPosition(this.position.id, this.form.value);
    } else {
      submit$ = this.createRequestService.addRequestPosition(this.requestId, [this.form.value])
        .pipe(map(positions => positions[0]));
    }

    submit$ = submit$.pipe(flatMap(position =>
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
