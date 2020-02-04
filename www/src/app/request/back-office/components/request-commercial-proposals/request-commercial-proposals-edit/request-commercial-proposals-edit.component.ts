import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { fromEvent, merge, Subscription } from "rxjs";
import { auditTime } from "rxjs/operators";
import { OffersService } from "../../../services/offers.service";
import { RequestPosition } from "../../../../common/models/request-position";
import { Uuid } from "../../../../../cart/models/uuid";
import * as moment from "moment";
import { CustomValidators } from "../../../../../shared/forms/custom.validators";
import { ContragentService } from "../../../../../contragent/services/contragent.service";

@Component({
  selector: 'app-request-commercial-proposals-edit',
  templateUrl: './request-commercial-proposals-edit.component.html',
  styleUrls: ['./request-commercial-proposals-edit.component.scss']
})
export class RequestCommercialProposalsEditComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() position: RequestPosition;
  @Input() selectedOffer: any;

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() editOffer = new EventEmitter();
  @Output() cancel = new EventEmitter();

  @Input() editOfferModalOpen = false;

  @ViewChild('contragentName', { static: false }) contragentName: ElementRef;

  isLoading: boolean;

  editCommercialProposalForm: FormGroup;
  editCommercialProposalFormHelper: FormGroup;

  quantityNotEnough = false;
  dateIsLaterThanNeeded = false;

  selectedContragentId: Uuid;

  subscription = new Subscription();

  get formDocuments() {
    return this.editCommercialProposalForm.get('documents') as FormArray;
  }

  constructor(
    private formBuilder: FormBuilder,
    protected offersService: OffersService,
    protected getContragentService: ContragentService,
  ) { }

  ngOnInit() {
    this.editCommercialProposalForm = this.formBuilder.group({
      supplierContragentId: [this.selectedOffer.supplierContragentId, Validators.required],
      priceWithVat: [this.selectedOffer.priceWithVat, [Validators.required, Validators.min(1)]],
      currency: [this.selectedOffer.currency, Validators.required],
      quantity: [this.selectedOffer.quantity, [Validators.required, Validators.min(1)]],
      measureUnit: [this.selectedOffer.measureUnit, Validators.required],
      deliveryDate: [moment(new Date(this.selectedOffer.deliveryDate)).format('DD.MM.YYYY'), [Validators.required, CustomValidators.futureDate()]],
      paymentTerms: [this.selectedOffer.paymentTerms, Validators.required],
      documents: this.formBuilder.array([]),
    });

    this.editCommercialProposalFormHelper = this.formBuilder.group({
      contragentName: [this.selectedOffer.supplierContragentName, Validators.required],
      contragent: [null, [Validators.required, (control) => this.supplierOfferExists(control)]],
    });
  }

  ngAfterViewInit() {
    merge(
      this.editCommercialProposalFormHelper.get("contragent").valueChanges,
      fromEvent(this.contragentName.nativeElement, "blur"),
    )
      .pipe(auditTime(100))
      .subscribe(() => {
        if (this.editCommercialProposalFormHelper.get("contragent").value) {
          const value = this.editCommercialProposalFormHelper.get("contragent").value;

          this.editCommercialProposalFormHelper.get("contragentName").setValue(value ? value[0].shortName : null, { emitEvent: false });
          this.editCommercialProposalFormHelper.get("contragentName").updateValueAndValidity();

          this.selectedContragentId = value ? value[0].id : null;
          this.editCommercialProposalForm.get("supplierContragentId").setValue(value ? value[0].id : null, { emitEvent: false });
          this.editCommercialProposalForm.get("supplierContragentId").updateValueAndValidity();

          if (this.editCommercialProposalFormHelper.get("contragent").errors) {
            this.editCommercialProposalFormHelper.get("contragentName").setErrors({ supplierOfferExist: true });
          } else {
            this.editCommercialProposalForm.updateValueAndValidity();
          }
        } else {
          this.getContragentService.getContragentInfo(
            this.editCommercialProposalForm.get("supplierContragentId").value
          ).subscribe((contragent) => {
            // this.editCommercialProposalFormHelper.get("contragent").setValue([contragent]);
            // // this.editCommercialProposalFormHelper.get("contragent").updateValueAndValidity();
            //
            // this.editCommercialProposalFormHelper.get("contragentName").setValue(contragent.shortName, { emitEvent: false });
            // // this.editCommercialProposalFormHelper.get("contragentName").updateValueAndValidity();
            //
            // this.editCommercialProposalForm.get("supplierContragentId").setValue(contragent.id, { emitEvent: false });
            // // this.editCommercialProposalForm.get("supplierContragentId").updateValueAndValidity();
            //
            // this.editCommercialProposalForm.updateValueAndValidity();
            //
            // if (this.editCommercialProposalFormHelper.get("contragent").errors &&
            //   contragent.id !== this.selectedOffer.supplierContragentName) {
            //   this.editCommercialProposalFormHelper.get("contragentName").setErrors({ supplierOfferExist: null });
            // } else {
            //   this.editCommercialProposalForm.updateValueAndValidity();
            // }
            //
            // console.log(this.editCommercialProposalForm);
            // console.log(this.editCommercialProposalFormHelper);
          });
        }
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
    this.editCommercialProposalForm.disable();

    const body = this.editCommercialProposalForm.value;

    // Отправляем КП
    this.offersService.addOffer(this.position.request.id, this.position.id, body).subscribe(tp => {
      this.editOffer.emit(tp);
    });
  }

  filterEnteredText(event: KeyboardEvent): boolean {
    const key = Number(event.key);
    return (key >= 0 && key <= 9);
  }

  /**
   * Функция проверяет, добавлено ли уже КП от выбранного поставщика
   *
   * @param control
   */
  supplierOfferExists(control: FormControl): any {
    if (!control.value || !this.position) {
      return null;
    }

    const ids = [];

    for (const linkedOffer of this.position.linkedOffers) {
      ids.push(linkedOffer.supplierContragentId);
    }

    if (ids.indexOf(control.value[0].id) !== -1) {
      return { supplierOfferExist: true };
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
      this.quantityNotEnough = value < position.quantity;
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

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
