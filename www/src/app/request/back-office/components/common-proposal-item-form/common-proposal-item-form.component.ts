import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from "@angular/forms";
import { CommonProposalItem } from "../../../common/models/common-proposal";
import { RequestPosition } from "../../../common/models/request-position";
import { CurrencyLabels } from "../../../common/dictionaries/currency-labels";
import { PaymentTermsLabels } from "../../../common/dictionaries/payment-terms-labels";
import { shareReplay } from "rxjs/operators";
import { OkeiService } from "../../../../shared/services/okei.service";
import { PositionCurrency } from "../../../common/enum/position-currency";
import { CustomValidators } from "../../../../shared/forms/custom.validators";
import { DatePipe } from "@angular/common";

@Component({
  selector: 'app-common-proposal-item-form',
  templateUrl: './common-proposal-item-form.component.html',
  styleUrls: ['./common-proposal-item-form.component.scss'],
  providers: [DatePipe]
})
export class CommonProposalItemFormComponent implements OnInit {

  @Input() position: RequestPosition;
  @Input() proposalItem: CommonProposalItem;
  @Output() close = new EventEmitter();
  @Output() save = new EventEmitter<Partial<CommonProposalItem>>();

  readonly currencies = Object.entries(CurrencyLabels);
  readonly paymentTerms = Object.entries(PaymentTermsLabels);
  readonly okeiList$ = this.okeiService.getOkeiList().pipe(shareReplay(1));
  readonly form = this.fb.group({
    id: null,
    requestPositionId: null,
    manufacturingName: [null, Validators.required],
    priceWithoutVat: [null, Validators.required],
    quantity: [null, [Validators.required, Validators.pattern("^[.0-9]+$"), Validators.min(0.0001)]],
    measureUnit: [null, Validators.required],
    currency: [PositionCurrency.RUB, Validators.required],
    deliveryDate: [null, CustomValidators.futureDate()],
    manufacturer: [null, Validators.required],
    standard: [null],
    paymentTerms: [null, Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    public okeiService: OkeiService,
    public datePipe: DatePipe,
  ) {}

  ngOnInit(): void {
    const { id, ...position }: RequestPosition = this.position;

    this.form.patchValue({
      ...{
        requestPositionId: id,
        manufacturingName: position?.name,
        priceWithoutVat: this.position?.startPrice
      },
      ...position ?? {},
      ...this.proposalItem ?? {},
      ...{ deliveryDate: this.parseDate(this.proposalItem?.deliveryDate ?? this.position.deliveryDate) }
    });

    if (this.proposalItem && !this.proposalItem.manufacturingName) {
      this.form.get('manufacturingName').setValue(this.position.name);
      this.form.get('manufacturingName').disable();
    }
  }

  submit() {
    if (this.form.invalid) { return; }

    this.save.emit(this.form.getRawValue());
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
}
