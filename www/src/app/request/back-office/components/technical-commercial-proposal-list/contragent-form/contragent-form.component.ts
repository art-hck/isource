import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ContragentList } from "../../../../../contragent/models/contragent-list";
import { shareReplay } from "rxjs/operators";
import { ContragentService } from "../../../../../contragent/services/contragent.service";
import { Store } from "@ngxs/store";
import { TechnicalCommercialProposals } from "../../../actions/technical-commercial-proposal.actions";
import { Request } from "../../../../common/models/request";
import CreateContragent = TechnicalCommercialProposals.CreateContragent;
import { ContragentShortInfo } from "../../../../../contragent/models/contragent-short-info";
import { PositionCurrency } from "../../../../common/enum/position-currency";
import { DeliveryType } from "../../../enum/delivery-type";
import { DeliveryTypeLabels } from "../../../../common/dictionaries/delivery-type-labels";
import { CurrencyLabels } from "../../../../common/dictionaries/currency-labels";
import { getCurrencySymbol } from "@angular/common";
import Create = TechnicalCommercialProposals.Create;
import { TechnicalCommercialProposal } from "../../../../common/models/technical-commercial-proposal";

@Component({
  selector: 'technical-commercial-proposal-contragent-form',
  templateUrl: 'contragent-form.component.html',
  styleUrls: ['./contragent-form.component.scss'],
})
export class TechnicalCommercialProposalContragentFormComponent implements OnInit {
  @Input() request: Request;
  @Input() selectedContragents: ContragentShortInfo[];
  @Input() edit: TechnicalCommercialProposal;
  @Output() close = new EventEmitter();
  readonly deliveryType = DeliveryType;
  readonly deliveryTypeLabel = DeliveryTypeLabels;
  readonly deliveryTypes = Object.entries(DeliveryTypeLabels);
  readonly currencies = Object.entries(CurrencyLabels);
  readonly getCurrencySymbol = getCurrencySymbol;
  readonly contragents$ = this.contragentService.getContragentList().pipe(shareReplay(1));
  form: FormGroup;
  invalidDocControl = false;

  constructor(
    private contragentService: ContragentService,
    private fb: FormBuilder,
    private store: Store,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      supplier: [this.edit?.supplier.shortName ?? null, Validators.required],
      files: [this.edit?.documents ?? []],
      deliveryType: [this.edit?.deliveryType ?? this.deliveryType.INCLUDED],
      deliveryAdditionalTerms: [this.edit?.deliveryAdditionalTerms ?? ''],
      warrantyConditions: [this.edit?.warrantyConditions ?? '', Validators.required],
      deliveryPrice: [this.edit?.deliveryPrice ?? ''],
      deliveryCurrency: [PositionCurrency.RUB],
      deliveryPickup: [this.edit?.deliveryPickup ?? '']
    });

    this.form.valueChanges.subscribe(() => {
      this.form.get('deliveryPickup').setValidators(
        this.form.get('deliveryType').value === this.deliveryType.PICKUP ? [Validators.required] : null);

      this.form.get('deliveryPrice').setValidators(
        this.form.get('deliveryType').value === this.deliveryType.NOT_INCLUDED ? [Validators.required] : null);

    });
    this.cd.detectChanges();
  }

  search(query: string, contragents: ContragentList[]) {
    return contragents.filter(c => c.shortName.toLowerCase().indexOf(query.toLowerCase()) >= 0 || c.inn.indexOf(query) >= 0);
  }

  contragentExists(contragent) {
    return this.selectedContragents.some(({id}) => id === contragent.id);
  }

  submit(publish = false) {
    if (this.form.valid) {
      const files = this.form.get('files').value.filter(({ valid }) => valid).map(({ file }) => file);
      this.store.dispatch(new Create(this.request.id, { ...this.form.value, files }, publish));
      this.close.emit();
    }
  }

  getContragentName = ({ shortName, fullName }: ContragentList) => shortName || fullName;
}
