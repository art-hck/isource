import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Observable, of, Subscription } from "rxjs";
import { mergeMap, shareReplay } from "rxjs/operators";
import { CommercialProposalsService } from "../../services/commercial-proposals.service";
import { RequestPosition } from "../../../common/models/request-position";
import { CustomValidators } from "../../../../shared/forms/custom.validators";
import { ContragentList } from "../../../../contragent/models/contragent-list";
import { Request } from "../../../common/models/request";
import { ContragentService } from "../../../../contragent/services/contragent.service";
import { OkeiService } from "../../../../shared/services/okei.service";
import { Store } from "@ngxs/store";
import { CommercialProposalsActions } from "../../actions/commercial-proposal.actions";
import { RequestOfferPosition } from "../../../common/models/request-offer-position";
import { ContragentShortInfo } from "../../../../contragent/models/contragent-short-info";
import { PositionCurrency } from "../../../common/enum/position-currency";
import { searchContragents } from "../../../../shared/helpers/search";
import { PaymentTermsLabels } from "../../../common/dictionaries/payment-terms-labels";
import { CommercialProposalFormValidators } from "./commercial-proposal-form.validators";
import { DatePipe } from "@angular/common";
import SaveProposal = CommercialProposalsActions.SaveProposal;

@Component({
  selector: 'app-request-commercial-proposal-form',
  templateUrl: './commercial-proposal-form.component.html',
  styleUrls: ['./commercial-proposal-form.component.scss'],
  providers: [DatePipe]
})
export class CommercialProposalFormComponent implements OnInit, OnDestroy {
  @Input() request: Request;
  @Input() position: RequestPosition;
  @Input() commercialProposal: RequestOfferPosition;
  @Input() supplier: ContragentShortInfo;
  @Output() close = new EventEmitter();
  @ViewChild('contragentName') contragentName: ElementRef;

  form: FormGroup;
  quantityNotEnough = false;
  contragents$: Observable<ContragentList[]>;

  readonly subscription = new Subscription();
  readonly searchContragents = searchContragents;
  readonly okeiList$ = this.okeiService.getOkeiList().pipe(shareReplay(1));
  readonly paymentTerms = Object.entries(PaymentTermsLabels);
  readonly validators = CommercialProposalFormValidators;
  readonly getContragentName = (contragent: ContragentList) => contragent.shortName || contragent.fullName;

  constructor(
    private formBuilder: FormBuilder,
    private offersService: CommercialProposalsService,
    private contragentService: ContragentService,
    public okeiService: OkeiService,
    public store: Store,
    private datePipe: DatePipe
  ) { }

  ngOnInit() {
    const p = this.commercialProposal;
    this.contragents$ = this.offersService
      .getContragentsWithTp(this.request.id, [this.position.id]).pipe(mergeMap(
        contragents => contragents.length === 0 ? this.contragentService.getContragentList() : of(contragents)
      ));

    this.form = this.formBuilder.group({
      id: p?.id,
      supplierContragentId: [this.supplier || p?.supplierContragent, [Validators.required, this.validators.supplierOfferExistsValidator(this.position)]],
      priceWithVat: [p?.priceWithVat ?? this.position.startPrice, [Validators.required, Validators.min(1)]],
      currency: [p?.currency ?? this.position.currency, Validators.required],
      quantity: [p?.quantity ?? this.position.quantity, [Validators.required, Validators.min(0.0001), Validators.pattern("^[.0-9]+$")]],
      measureUnit: [p?.measureUnit ?? this.position.measureUnit, Validators.required],
      deliveryDate: [this.parseDate(p?.deliveryDate ?? this.position.deliveryDate), [Validators.required, CustomValidators.futureDate()]],
      paymentTerms: [p?.paymentTerms ?? this.position.paymentTerms, Validators.required],
      manufacturer: [p?.manufacturer ?? '', Validators.required],
      standard: [p?.standard ?? ''],
    });

    // @TODO Временное отключение валют
    this.form.get('currency').setValue(PositionCurrency.RUB);
    this.form.get('currency').disable();

    if (this.supplier || this.commercialProposal?.supplierContragent) {
      this.form.get('supplierContragentId').disable();
    }
  }

  submit() {
    if (this.form.invalid) { return; }

    this.form.disable();
    this.store.dispatch(new SaveProposal(this.position.request.id, this.position.id, {
      ...this.form.value,
      supplierContragentId: this.form.get('supplierContragentId').value,
    }));
    this.close.emit();
  }

  private parseDate(date: string) {
    if (!date) { return null; }

    try {
      return this.datePipe.transform(new Date(date), 'dd.MM.yyyy');
    } catch (e) {
      return date;
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
