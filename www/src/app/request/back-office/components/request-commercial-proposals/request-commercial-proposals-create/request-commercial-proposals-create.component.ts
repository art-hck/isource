import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { fromEvent, merge, Observable, of, Subscription } from "rxjs";
import { auditTime, mergeMap } from "rxjs/operators";
import { CommercialProposalsService } from "../../../services/commercial-proposals.service";
import { RequestPosition } from "../../../../common/models/request-position";
import { Uuid } from "../../../../../cart/models/uuid";
import * as moment from "moment";
import { CustomValidators } from "../../../../../shared/forms/custom.validators";
import { CommercialProposal } from "../../../../common/models/commercial-proposal";
import { ContragentList } from "../../../../../contragent/models/contragent-list";
import { Request } from "../../../../common/models/request";
import { ContragentService } from "../../../../../contragent/services/contragent.service";

@Component({
  selector: 'app-request-commercial-proposals-create',
  templateUrl: './request-commercial-proposals-create.component.html',
  styleUrls: ['./request-commercial-proposals-create.component.scss']
})
export class RequestCommercialProposalsCreateComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() request: Request;
  @Input() position: RequestPosition;
  @Input() commercialProposal: CommercialProposal;
  @Input() addOfferModalOpen = false;
  @Input() editMode = false;

  @Output() create = new EventEmitter();
  @Output() edit = new EventEmitter();
  @Output() cancel = new EventEmitter();

  @ViewChild('contragentName', { static: false }) contragentName: ElementRef;

  newCommercialProposalForm: FormGroup;
  newCommercialProposalFormHelper: FormGroup;

  quantityNotEnough = false;
  dateIsLaterThanNeeded = false;

  selectedContragentId: Uuid;

  subscription = new Subscription();
  contragents$: Observable<ContragentList[]>;

  get formDocuments() {
    return this.newCommercialProposalForm.get('documents') as FormArray;
  }

  constructor(
    private formBuilder: FormBuilder,
    protected offersService: CommercialProposalsService,
    private contragentService: ContragentService
  ) { }

  ngOnInit() {
    this.contragents$ = this.offersService.getContragentsWithTp(this.request.id, [this.position]).pipe(mergeMap((contragents) => {
      if (contragents.length === 0) {
        return this.contragentService.getContragentList();
      } else {
        return of(contragents);
      }
    }));

    this.newCommercialProposalForm = this.formBuilder.group({
      id: [this.defaultCPValue('id', null)],
      supplierContragentId: [this.defaultCPValue('supplierContragentId'), Validators.required],
      priceWithVat: [this.defaultCPValue('priceWithVat', this.position.startPrice || null), [Validators.required, Validators.min(1)]],
      currency: [this.defaultCPValue('currency', this.position.currency || null), Validators.required],
      quantity: [this.defaultCPValue('quantity', this.position.quantity || null), [Validators.required, Validators.min(1)]],
      measureUnit: [this.defaultCPValue('measureUnit', this.position.measureUnit || null), Validators.required],
      deliveryDate: [this.defaultDeliveryDate, [Validators.required, CustomValidators.futureDate()]],
      paymentTerms: [this.defaultCPValue('paymentTerms', this.position.paymentTerms || null), Validators.required],
      documents: this.formBuilder.array([]),
    });

    this.newCommercialProposalFormHelper = this.formBuilder.group({
      contragentName: [null, Validators.required],
      contragent: [null, [Validators.required, (control) => this.supplierOfferExists(control)]],
    });

    if (this.commercialProposal) {
      const contragentName = this.commercialProposal.supplierContragentName;
      this.newCommercialProposalFormHelper.get("contragentName").setValue(contragentName, { emitEvent: false });

      this.newCommercialProposalFormHelper.get("contragentName").disable();
      this.newCommercialProposalFormHelper.get("contragent").disable();
      this.newCommercialProposalForm.get("supplierContragentId").disable();
    }
  }

  ngAfterViewInit() {
    // // @TODO: uxg-autocomplete!
    merge(
      this.newCommercialProposalFormHelper.get("contragent").valueChanges,
      fromEvent(this.contragentName.nativeElement, "blur"),
    )
      .pipe(auditTime(100))
      .subscribe(() => {
        const value = this.newCommercialProposalFormHelper.get("contragent").value;

        this.newCommercialProposalFormHelper.get("contragentName").setValue(value ? value[0].shortName : null, { emitEvent: false });
        this.newCommercialProposalFormHelper.get("contragentName").updateValueAndValidity();

        this.selectedContragentId = value ? value[0].id : null;
        this.newCommercialProposalForm.get("supplierContragentId").setValue(value ? value[0].id : null, { emitEvent: false });
        this.newCommercialProposalForm.get("supplierContragentId").updateValueAndValidity();

        if (this.newCommercialProposalFormHelper.get("contragent").errors) {
          this.newCommercialProposalFormHelper.get("contragentName").setErrors({ supplierOfferExist: true });
        } else {
          this.newCommercialProposalForm.updateValueAndValidity();
        }
      });
  }

  filesSelected(files: File[]): void {
    files.map(file => this.formBuilder.control(file))
      .forEach(control => this.formDocuments.push(control));
  }

  submit() {
    this.newCommercialProposalForm.disable();

    const body = this.newCommercialProposalForm.value;

    // Отправляем КП
    if (!this.editMode) {
      this.offersService.addOffer(this.position.request.id, this.position.id, body).subscribe(cp => {
        this.create.emit(cp);
      });
    } else {
      this.offersService.editOffer(this.position.request.id, this.position.id, body).subscribe(cp => {
        this.edit.emit(cp);
      });
    }
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

  private get defaultDeliveryDate() {
    const deliveryDate = this.defaultCPValue('deliveryDate', this.position.deliveryDate);
    return deliveryDate ? moment(new Date(deliveryDate)).format('DD.MM.YYYY') : null;
  }

  defaultCPValue = (field: keyof CommercialProposal, defaultValue: any = "") => this.commercialProposal && this.commercialProposal[field] || defaultValue;

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
