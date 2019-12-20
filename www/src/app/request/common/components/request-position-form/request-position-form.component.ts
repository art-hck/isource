import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DatePipe } from "@angular/common";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { map } from "rxjs/operators";
import { Observable, Subscription } from "rxjs";
import { CreateRequestService } from "../../services/create-request.service";
import { CustomValidators } from "../../../../shared/forms/custom.validators";
import { EditRequestService } from "../../services/edit-request.service";
import { PositionCurrency } from "../../enum/position-currency";
import { RequestPosition } from "../../models/request-position";
import { RequestPositionStatusService } from "../../services/request-position-status.service";
import { RequestPositionWorkflowSteps as PositionStatuses } from "../../enum/request-position-workflow-steps";
import { Uuid } from "../../../../cart/models/uuid";

@Component({
  selector: 'app-request-position-form',
  templateUrl: './request-position-form.component.html',
  styleUrls: ['./request-position-form.component.scss'],
  providers: [DatePipe]
})

export class RequestPositionFormComponent implements OnInit {
  @Input() reqeustId: Uuid;
  @Input() position: RequestPosition = new RequestPosition();
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

  readonly disabedFieldsAfterStatus = {
    // Вырубаем поля после Согласования ТП
    [PositionStatuses.TECHNICAL_PROPOSALS_AGREEMENT]:
      ['name', 'comments', 'currency', 'deliveryDate', 'isDeliveryDateAsap', 'measureUnit', 'productionDocument', 'startPrice'],
    // Вырубаем ПНР после подготвки КП
    [PositionStatuses.PROPOSALS_PREPARATION]:
      ['isShmrRequired', 'isPnrRequired'],
    // Вырубаем инспекционный контроль после подписания договора
    [PositionStatuses.CONTRACT_SIGNING]:
      ['isInspectionControlRequired'],
    // Вырубаем РКД после изготовления
    [PositionStatuses.MANUFACTURING]:
      ['isDesignRequired']
  };

  constructor(
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private statusService: RequestPositionStatusService,
    private createRequestService: CreateRequestService,
    private editRequestService: EditRequestService,
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
      paymentTerms: [p.paymentTerms, Validators.required],
      productionDocument: [p.productionDocument, Validators.required],
      quantity: [p.quantity, [Validators.required, Validators.min(1)]],
      startPrice: [p.startPrice, Validators.min(1)]
    });

    Object.entries(this.disabedFieldsAfterStatus)
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

    this.form = form;
  }

  submit() {
    let submit$: Observable<RequestPosition>;
    if (this.position.id) {
      submit$ = this.editRequestService.updateRequestPosition(this.position.id, this.form.value);
    } else {
      submit$ = this.createRequestService.addRequestPosition(this.reqeustId, this.form.value)
        .pipe(map(positions => positions[0]));
    }

    this.form.disable();
    this.subscription.add(submit$.subscribe(position => {
      this.positionChange.emit(position);
      this.position = position;
      this.form.enable();
    }));
  }
}
