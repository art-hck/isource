import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { iif, Observable, of, Subscription } from "rxjs";
import { mergeMap, shareReplay } from "rxjs/operators";
import { CommercialProposalsService } from "../../services/commercial-proposals.service";
import { RequestPosition } from "../../../common/models/request-position";
import * as moment from "moment";
import { CustomValidators } from "../../../../shared/forms/custom.validators";
import { CommercialProposal } from "../../../common/models/commercial-proposal";
import { ContragentList } from "../../../../contragent/models/contragent-list";
import { Request } from "../../../common/models/request";
import { ContragentService } from "../../../../contragent/services/contragent.service";
import { OkeiService } from "../../../../shared/services/okei.service";
import { Okei } from "../../../../shared/models/okei";

@Component({
  selector: 'app-request-commercial-proposal-form',
  templateUrl: './commercial-proposal-form.component.html',
  styleUrls: ['./commercial-proposal-form.component.scss']
})
export class CommercialProposalFormComponent implements OnInit, OnDestroy {
  @Input() request: Request;
  @Input() position: RequestPosition;
  @Input() commercialProposal: CommercialProposal;
  @Input() addOfferModalOpen = false;
  @Input() editMode = false;
  @Output() create = new EventEmitter();
  @Output() edit = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @ViewChild('contragentName') contragentName: ElementRef;

  newCommercialProposalForm: FormGroup;
  supplierContragentControl: FormControl;
  quantityNotEnough = false;
  dateIsLaterThanNeeded = false;
  subscription = new Subscription();
  contragents$: Observable<ContragentList[]>;
  okeiList$: Observable<Okei[]>;

  get formDocuments() {
    return this.newCommercialProposalForm.get('documents') as FormArray;
  }

  constructor(
    private formBuilder: FormBuilder,
    private offersService: CommercialProposalsService,
    private contragentService: ContragentService,
    public okeiService: OkeiService
  ) { }

  ngOnInit() {

    this.contragents$ = this.offersService
      .getContragentsWithTp(this.request.id, [this.position.id]).pipe(mergeMap(
        contragents => contragents.length === 0 ? this.contragentService.getContragentList() : of(contragents)
      ));

    this.okeiList$ = this.okeiService.getOkeiList().pipe(shareReplay(1));

    this.newCommercialProposalForm = this.formBuilder.group({
      id: [this.defaultCPValue('id', null)],
      priceWithVat: [this.defaultCPValue('priceWithVat', this.position.startPrice || null), [Validators.required, Validators.min(1)]],
      currency: [this.defaultCPValue('currency', this.position.currency || null), Validators.required],
      quantity: [this.defaultCPValue('quantity', this.position.quantity || null), [Validators.required, Validators.min(1)]],
      measureUnit: [this.defaultCPValue('measureUnit', this.position.measureUnit || null), Validators.required],
      deliveryDate: [this.defaultDeliveryDate, [Validators.required, CustomValidators.futureDate()]],
      paymentTerms: [this.defaultCPValue('paymentTerms', this.position.paymentTerms || null), Validators.required],
      documents: this.formBuilder.array([]),
    });

    this.supplierContragentControl = this.formBuilder.control(
      this.defaultCPValue('supplierContragent'),
      [Validators.required, (control) => this.supplierOfferExistsValidator(control)]
    );

    if (this.editMode) {
      this.supplierContragentControl.disable();
    }
  }

  filesSelected(files: File[]): void {
    files.map(file => this.formBuilder.control(file))
      .forEach(control => this.formDocuments.push(control));
  }

  submit() {
    this.newCommercialProposalForm.disable();

    const body = {
      ...this.newCommercialProposalForm.value,
      supplierContragentId: this.supplierContragentControl.value.id
    };

    // Отправляем КП
    if (!this.editMode) {
      this.subscription.add(this.offersService.addOffer(this.position.request.id, this.position.id, body)
        .subscribe(cp => this.create.emit(cp))
      );
    } else {
      this.subscription.add(this.offersService.editOffer(this.position.request.id, this.position.id, body)
        .subscribe(cp => this.edit.emit(cp))
      );
    }
  }

  filterEnteredText(event: KeyboardEvent): boolean {
    const key = Number(event.key);
    return (key >= 0 && key <= 9);
  }

  supplierOfferExistsValidator(control: AbstractControl): CustomValidators {
    return control.value && this.position && this.position.linkedOffers
      .some(linkedOffer => linkedOffer.supplierContragent.id === control.value.id) ? { supplierOfferExist: true } : null;
  }

  quantityValidator(): CustomValidators {
    const value = this.newCommercialProposalForm.get('quantity').value;
    return (!value || value === '' || value >= this.position.quantity) ? null : { "quantityNotEnough": true };
    if (!value || value === '') {
      this.quantityNotEnough = false;
    } else {
      this.quantityNotEnough = value < this.position.quantity;
    }
  }

  deliveryDateValidator(): CustomValidators {
    const enteredDate = this.newCommercialProposalForm.get('deliveryDate').value;
    if (!moment(enteredDate, 'DD.MM.YYYY', true).isValid()) {
      this.dateIsLaterThanNeeded = false;
      return null;
    } else {
      const controlDate = moment(moment(this.position.deliveryDate).format('DD.MM.YYYY'), 'DD.MM.YYYY');
      const validationDate = moment(enteredDate, 'DD.MM.YYYY');

      return controlDate.isBefore(validationDate) ? { dateIsLaterThanNeeded: true } : null;
    }
  }

  private get defaultDeliveryDate() {
    const deliveryDate = this.defaultCPValue('deliveryDate', this.position.deliveryDate);
    return deliveryDate ? moment(new Date(deliveryDate)).format('DD.MM.YYYY') : null;
  }

  defaultCPValue = (field: keyof CommercialProposal, defaultValue: any = "") => this.commercialProposal && this.commercialProposal[field] || defaultValue;
  getContragentName = (contragent: ContragentList) => contragent.shortName || contragent.fullName;
  searchContragent = (query: string, contragents: ContragentList[]) => {
    return contragents.filter(
      c => c.shortName.toLowerCase().indexOf(query.toLowerCase()) >= 0 || c.inn.indexOf(query) >= 0);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
