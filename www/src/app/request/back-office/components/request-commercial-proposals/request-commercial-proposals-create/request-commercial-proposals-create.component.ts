import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { fromEvent, merge, Observable } from "rxjs";
import { auditTime } from "rxjs/operators";
import { OffersService } from "../../../services/offers.service";
import { RequestPosition } from "../../../../common/models/request-position";
import { Uuid } from "../../../../../cart/models/uuid";
import { RequestOfferPosition } from "../../../../common/models/request-offer-position";
import * as moment from "moment";

@Component({
  selector: 'app-request-commercial-proposals-create',
  templateUrl: './request-commercial-proposals-create.component.html',
  styleUrls: ['./request-commercial-proposals-create.component.scss']
})
export class RequestCommercialProposalsCreateComponent implements OnInit, AfterViewInit {
  @Input() position: RequestPosition;

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() onAddOffer = new EventEmitter();
  @Output() cancel = new EventEmitter();

  @Input() addOfferModalOpen = false;
  @Output() addOfferModalOpenChange = new EventEmitter<boolean>();

  @ViewChild('contragentName', { static: false }) contragentName: ElementRef;

  isLoading: boolean;

  newCommercialProposalForm: FormGroup;

  quantityNotEnough = false;
  dateIsLaterThanNeeded = false;

  selectedContragentId: Uuid;

  get formDocuments() {
    return this.newCommercialProposalForm.get('documents') as FormArray;
  }

  constructor(
    private formBuilder: FormBuilder,
    protected offersService: OffersService,
  ) { }

  ngOnInit() {
    this.newCommercialProposalForm = this.formBuilder.group({
      contragentName: [null, Validators.required],
      supplierContragentId: [null, Validators.required],
      contragent: [null, Validators.required],
      priceWithVat: [null, [Validators.required, Validators.min(1)]],
      currency: ['RUB', Validators.required],
      quantity: [null, [Validators.required, Validators.min(1)]],
      measureUnit: [null, Validators.required],
      deliveryDate: [null, Validators.required],
      paymentTerms: ['30 дней по факту поставки', Validators.required],
      documents: this.formBuilder.array([]),
    });
  }

  ngAfterViewInit() {
    // // @TODO: uxg-autocomplete!
    merge(
      this.newCommercialProposalForm.get("contragent").valueChanges,
      fromEvent(this.contragentName.nativeElement, "blur"),
    )
      .pipe(auditTime(100))
      .subscribe(() => {
        const value = this.newCommercialProposalForm.get("contragent").value;

        this.newCommercialProposalForm.get("contragentName").setValue(value ? value[0].shortName : null, { emitEvent: false });
        this.newCommercialProposalForm.get("contragentName").updateValueAndValidity();

        this.selectedContragentId = value ? value[0].id : null;
        this.newCommercialProposalForm.get("supplierContragentId").setValue(value ? value[0].id : null, { emitEvent: false });
        this.newCommercialProposalForm.get("supplierContragentId").updateValueAndValidity();
      });
  }

  filesDropped(files: FileList): void {
    Array.from(files).forEach(
      file => this.formDocuments.push(this.formBuilder.control(file))
    );
  }

  filesSelected(e) {
    this.filesDropped(e.target.files);
    e.target.value = '';
  }

  submit() {
    this.isLoading = true;
    this.newCommercialProposalForm.disable();

    const body = <RequestOfferPosition>{
      supplierContragentId: this.newCommercialProposalForm.get("supplierContragentId").value,
      priceWithVat: this.newCommercialProposalForm.get("priceWithVat").value,
      currency: this.newCommercialProposalForm.get("currency").value,
      quantity: this.newCommercialProposalForm.get("quantity").value,
      measureUnit: this.newCommercialProposalForm.get("measureUnit").value,
      deliveryDate: this.newCommercialProposalForm.get("deliveryDate").value,
      paymentTerms: this.newCommercialProposalForm.get("paymentTerms").value,
      documents: this.newCommercialProposalForm.get("documents").value,
    };

    // Отправляем КП
    const cp$: Observable<any> = this.offersService.addOffer(this.position.request.id, this.position.id, body);

    cp$.subscribe(tp => {
      this.onModalClose();
      this.onAddOffer.emit(tp);
    });
  }

  filterEnteredText(event: KeyboardEvent): boolean {
    const key = Number(event.key);
    return (key >= 0 && key <= 9);
  }

  /**
   * Функция проверяет, добавлено ли уже КП от выбранного поставщика
   *
   * @param positionWithOffers
   * @param supplierId
   */
  isSupplierOfferExist(positionWithOffers: any, supplierId: Uuid): boolean {
    if (!supplierId) {
      return false;
    }

    const ids = [];

    for (const linkedOffer of positionWithOffers.linkedOffers) {
      ids.push(linkedOffer.supplierContragentId);
    }

    if (ids.indexOf(supplierId) !== -1) {
      this.newCommercialProposalForm.setErrors({ supplierOfferExist: true });
      return true;
    } else {
      this.newCommercialProposalForm.setErrors(null);
      return false;
    }
  }

  /**
   * Функция проверяет, введено ли количество меньше требуемого количества
   *
   * @param position
   * @param value
   */
  checkQuantity(position, value): void {
    if (!value || value === '') {
      this.quantityNotEnough = false;
    } else {
      this.quantityNotEnough = value < position.startPrice;
    }
  }

  /**
   * Функция проверяет, введена ли дата доставки раньше требуемой по позиции даты
   *
   * @param position
   * @param enteredDate
   */
  checkDeliveryDate(position, enteredDate): void {
    if (!moment(enteredDate, 'DD.MM.YYYY', true).isValid()) {
      this.dateIsLaterThanNeeded = false;
    } else {
      const controlDate = moment(moment(position.deliveryDate).format('DD.MM.YYYY'), 'DD.MM.YYYY');
      const validationDate = moment(enteredDate, 'DD.MM.YYYY');

      this.dateIsLaterThanNeeded = controlDate.isBefore(validationDate);
    }
  }

  onModalClose(): void {
    this.addOfferModalOpenChange.emit(false);

    this.newCommercialProposalForm.reset({
      contragentName: null,
      supplierContragentId: null,
      contragent: null,
      priceWithVat: null,
      currency: 'RUB',
      quantity: null,
      measureUnit: null,
      deliveryDate: null,
      paymentTerms: '30 дней по факту поставки',
      documents: this.formBuilder.array([]),
    });

    this.newCommercialProposalForm.enable();
  }
}
