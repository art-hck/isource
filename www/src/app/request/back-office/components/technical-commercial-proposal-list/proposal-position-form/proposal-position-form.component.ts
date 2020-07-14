import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { PositionCurrency } from "../../../../common/enum/position-currency";
import { CustomValidators } from "../../../../../shared/forms/custom.validators";
import { TechnicalCommercialProposalPosition } from "../../../../common/models/technical-commercial-proposal-position";
import { DatePipe } from "@angular/common";
import { CurrencyLabels } from "../../../../common/dictionaries/currency-labels";
import { PaymentTermsLabels } from "../../../../common/dictionaries/payment-terms-labels";
import { RequestPosition } from "../../../../common/models/request-position";
import { OkeiService } from "../../../../../shared/services/okei.service";
import { shareReplay } from "rxjs/operators";
import { Store } from "@ngxs/store";
import { TechnicalCommercialProposals } from "../../../actions/technical-commercial-proposal.actions";
import CreatePosition = TechnicalCommercialProposals.CreatePosition;
import { TechnicalCommercialProposal } from "../../../../common/models/technical-commercial-proposal";

@Component({
  selector: 'technical-commercial-proposal-position-form',
  templateUrl: 'proposal-position-form.component.html',
  styleUrls: ['proposal-position-form.component.scss'],
  providers: [DatePipe]
})

export class TechnicalCommercialProposalPositionFormComponent implements OnInit {
  @Input() position: RequestPosition;
  @Input() proposal: TechnicalCommercialProposal;
  @Output() close = new EventEmitter();

  form: FormGroup;
  readonly currencies = Object.entries(CurrencyLabels);
  readonly paymentTerms = Object.entries(PaymentTermsLabels);
  readonly okeiList$ = this.okeiService.getOkeiList().pipe(shareReplay(1));

  constructor(
    public okeiService: OkeiService,
    private fb: FormBuilder,
    private store: Store,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {
    const p = this.getProposalPosition(this.proposal, this.position);

    this.form = this.fb.group({
      id: [p?.id ?? null],
      position: [this.position, Validators.required],
      manufacturingName: [p?.manufacturingName ?? this.position.name, Validators.required],
      priceWithoutVat: [p?.priceWithoutVat ?? this.position.startPrice, Validators.required],
      quantity: [p?.quantity ?? this.position.quantity, [Validators.required, Validators.pattern("^[.0-9]+$"), Validators.min(0.0001)]],
      measureUnit: [p?.measureUnit ?? this.position.measureUnit, Validators.required],
      currency: [p?.currency ?? this.position.currency ?? PositionCurrency.RUB, Validators.required],
      deliveryDate: [this.parseDate(p?.deliveryDate ?? this.position.deliveryDate), CustomValidators.futureDate()],
      paymentTerms: [p?.paymentTerms ?? this.position.paymentTerms, Validators.required],
    });

    // @TODO Временное отключение валют
    this.form.get('currency').setValue(PositionCurrency.RUB);
    this.form.get('currency').disable();
  }

  submit() {
    const proposalPosition: TechnicalCommercialProposalPosition = this.form.getRawValue();
    const proposalPositions: TechnicalCommercialProposalPosition[] = [...this.proposal?.positions];
    const i = proposalPositions?.findIndex(({id}) => proposalPosition.id === id);

    i >= 0 ? proposalPositions[i] = proposalPosition : proposalPositions.push(proposalPosition);

    proposalPosition.deliveryDate = this.form.getRawValue().deliveryDate.replace(/(\d{2}).(\d{2}).(\d{4})/, '$3-$2-$1');

    this.store.dispatch(new CreatePosition({ ...this.proposal, positions: proposalPositions }));
    this.close.emit();
  }

  private parseDate(date: string) {
    if (!date) {
      return null;
    }

    try {
      return this.datePipe.transform(new Date(date), 'dd.MM.yyyy');
    } catch (e) {
      return date;
    }
  }

  private getProposalPosition({positions}: TechnicalCommercialProposal, {id}: RequestPosition): TechnicalCommercialProposalPosition {
    return positions.find(({position}) => position.id === id);
  }
}
