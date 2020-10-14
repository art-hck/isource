import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ContragentList } from "../../../../../contragent/models/contragent-list";
import { shareReplay } from "rxjs/operators";
import { ContragentService } from "../../../../../contragent/services/contragent.service";
import { Store } from "@ngxs/store";
import { TechnicalCommercialProposals } from "../../../actions/technical-commercial-proposal.actions";
import { Request } from "../../../../common/models/request";
import { ContragentShortInfo } from "../../../../../contragent/models/contragent-short-info";
import { PositionCurrency } from "../../../../common/enum/position-currency";
import { DeliveryType } from "../../../enum/delivery-type";
import { DeliveryTypeLabels } from "../../../../common/dictionaries/delivery-type-labels";
import { CurrencyLabels } from "../../../../common/dictionaries/currency-labels";
import { getCurrencySymbol } from "@angular/common";
import { Uuid } from "../../../../../cart/models/uuid";
import { TechnicalCommercialProposal } from "../../../../common/models/technical-commercial-proposal";
import { searchContragents } from "../../../../../shared/helpers/search";
import Create = TechnicalCommercialProposals.Create;
import UpdateParams = TechnicalCommercialProposals.UpdateParams;

@Component({
  selector: 'technical-commercial-proposal-contragent-form',
  templateUrl: 'contragent-form.component.html',
  styleUrls: ['./contragent-form.component.scss'],
})
export class TechnicalCommercialProposalContragentFormComponent implements OnInit {
  @Input() request: Request;
  @Input() groupId: Uuid;
  @Input() selectedContragents: ContragentShortInfo[];
  @Input() edit: TechnicalCommercialProposal;
  @Output() close = new EventEmitter();
  readonly deliveryType = DeliveryType;
  readonly deliveryTypeLabel = DeliveryTypeLabels;
  readonly deliveryTypes = Object.entries(DeliveryTypeLabels);
  readonly currencies = Object.entries(CurrencyLabels);
  readonly getCurrencySymbol = getCurrencySymbol;
  readonly contragents$ = this.contragentService.getContragentList().pipe(shareReplay(1));
  readonly searchContragents = searchContragents;
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
      supplier: [this.edit?.supplier ?? null, Validators.required],
      files: [[]],
      documents: [this.defaultValue('documents', [])],
      deliveryType: [this.edit?.deliveryType ?? this.deliveryType.INCLUDED],
      deliveryAdditionalTerms: [this.edit?.deliveryAdditionalTerms ?? ''],
      warrantyConditions: [this.edit?.warrantyConditions ?? '', Validators.required],
      deliveryPrice: [this.edit?.deliveryPrice ?? ''],
      deliveryCurrency: [PositionCurrency.RUB],
      deliveryPickup: [this.edit?.deliveryPickup ?? '']
    });

    if (this.edit) {
      this.form.addControl("id", this.fb.control(this.defaultValue('id', null)));
    }

    this.form.valueChanges.subscribe(() => {
      this.form.get('deliveryPickup').setValidators(
        this.form.get('deliveryType').value === this.deliveryType.PICKUP ? [Validators.required] : null);

      this.form.get('deliveryPrice').setValidators(
        this.form.get('deliveryType').value === this.deliveryType.NOT_INCLUDED ? [Validators.required] : null);

    });
    this.cd.detectChanges();
  }

  contragentExists(contragent) {
    return this.selectedContragents.some(({id}) => id === contragent.id);
  }

  submit(publish = false) {
    if (this.form.valid) {
      const files = this.form.get('files').value.filter(({ valid }) => valid).map(({ file }) => file);
      this.store.dispatch(this.edit ? new UpdateParams(this.request.id, {...this.form.value, files })
        : new Create(this.request.id, this.groupId, { ...this.form.value, files }, publish));
      this.close.emit();
    }
  }

  defaultValue = (field: keyof TechnicalCommercialProposal, defaultValue: any = "") => this.edit && this.edit[field] || defaultValue;
  getContragentName = ({ shortName, fullName }: ContragentList) => shortName || fullName;
}
