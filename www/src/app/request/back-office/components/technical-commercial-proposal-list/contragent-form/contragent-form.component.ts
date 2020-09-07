import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
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

@Component({
  selector: 'technical-commercial-proposal-contragent-form',
  templateUrl: 'contragent-form.component.html',
  styleUrls: ['./contragent-form.component.scss'],
})
export class TechnicalCommercialProposalContragentFormComponent {
  @Input() request: Request;
  @Input() selectedContragents: ContragentShortInfo[];
  @Output() close = new EventEmitter();
  readonly deliveryType = DeliveryType;
  readonly deliveryTypeLabel = DeliveryTypeLabels;
  readonly currencies = Object.entries(CurrencyLabels);
  readonly getCurrencySymbol = getCurrencySymbol;
  readonly contragents$ = this.contragentService.getContragentList().pipe(shareReplay(1));
  form: FormGroup;

  constructor(
    private contragentService: ContragentService,
    private fb: FormBuilder,
    private store: Store,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      supplier: [null, Validators.required],
      files: [[]],
      deliveryType: [this.deliveryType.INCLUDED],
      deliveryAdditionalTerms: ['', Validators.required],
      warrantyConditions: ['', Validators.required],
      deliveryPrice: [''],
      deliveryCurrency: [PositionCurrency.RUB],
      deliveryPickup: ['']
    });

    this.form.valueChanges.subscribe(() =>{
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

  submit() {
    if (this.form.valid) {
      this.store.dispatch(new CreateContragent(this.request.id, this.form.value));
      this.close.emit();
    }
  }

  getContragentName = ({ shortName, fullName }: ContragentList) => shortName || fullName;
}
