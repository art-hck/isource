import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { KimPriceOrder } from "../../../common/models/kim-price-order";
import { Store } from "@ngxs/store";
import { PriceOrderActions } from "../../actions/price-order.actions";
import { Uuid } from "../../../../cart/models/uuid";
import { KimPriceOrderType } from "../../../common/enum/kim-price-order-type";
import { PaymentTermsLabels } from "../../../../request/common/dictionaries/payment-terms-labels";
import { KimPriceOrderTypeLabels } from "../../../common/dictionaries/kim-price-order-type-labels";
import { Observable } from "rxjs";
import { OkatoRegion } from "../../../../shared/models/okato-region";
import { OkatoService } from "../../../../shared/services/okpd2.service";
import { PriceOrderFormValidators } from "./price-order-form.validators";
import Create = PriceOrderActions.Create;
import Update = PriceOrderActions.Update;
import { TextMaskConfig } from "angular2-text-mask/src/angular2TextMask";
import * as moment from "moment";

@Component({
  selector: 'app-kim-price-order-form',
  templateUrl: './price-order-form.component.html',
  styleUrls: ['./price-order-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PriceOrderFormComponent implements OnInit {
  @Input() kimPriceOrder: KimPriceOrder;
  @Output() close = new EventEmitter();
  form: FormGroup;
  regions$: Observable<OkatoRegion[]>;
  readonly time = this.fb.control("", Validators.required);
  readonly paymentTermsLabels = Object.entries(PaymentTermsLabels);
  readonly typeLabels = Object.entries(KimPriceOrderTypeLabels);
  readonly mask: TextMaskConfig = {
    mask: value => [/[0-2]/, value[0] === "1" ? /[0-9]/ : /[0-3]/, ' ', ':', ' ', /[0-5]/, /\d/],
    guide: false,
    keepCharPositions: true
  };
  readonly getRegionName = ({name}) => name;
  readonly searchRegions = (query: string, items: OkatoRegion[]) => {
    return items.filter(item => item.name.toLowerCase().indexOf(query.toLowerCase()) >= 0);
  }

  constructor(private fb: FormBuilder, private store: Store, private okatoService: OkatoService) { }

  ngOnInit() {
    this.form = this.fb.group({
      id: null,
      name: ["", Validators.required],
      regions: ["", Validators.required],
      deliveryAddress: ["", Validators.required],
      deliveryConditions: ["", Validators.required],
      dateResponse: ["", [Validators.required, PriceOrderFormValidators.dateResponseValidator]],
      dateDelivery: ["", Validators.required],
      type: [KimPriceOrderType.STANDART, Validators.required],
      forSmallBusiness: false,
      forProducer: false,
      forAuthorizedDealer: false,
      russianProduction: false,
      denyMaxPricePosition: false,
      positions: [null, [Validators.required, PriceOrderFormValidator.positions]]
    });

    this.form.get('type').disable();
    this.form.patchValue(this.kimPriceOrder || {});

    this.regions$ = this.okatoService.getRegions();
  }

  submit() {
    const body: Partial<KimPriceOrder> & {id: Uuid} = this.form.value;
    body.dateResponse = moment(body.dateResponse + " " + this.time.value, "DD.MM.YYYY HH:mm").toISOString();
    body.regions = this.form.value.regions.code;
    this.store.dispatch(body.id ? new Update(body) : new Create(body));
    this.close.emit();
  }
}
