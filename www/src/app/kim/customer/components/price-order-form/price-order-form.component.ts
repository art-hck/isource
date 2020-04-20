import { ChangeDetectionStrategy, Component, EventEmitter, HostBinding, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { KimPriceOrder } from "../../../common/models/kim-price-order";
import { Select, Store } from "@ngxs/store";
import { PriceOrderActions } from "../../actions/price-order.actions";
import { Uuid } from "../../../../cart/models/uuid";
import { KimPriceOrderType } from "../../../common/enum/kim-price-order-type";
import { PaymentTermsLabels } from "../../../../request/common/dictionaries/payment-terms-labels";
import { KimPriceOrderTypeLabels } from "../../../common/dictionaries/kim-price-order-type-labels";
import { Observable, Subject } from "rxjs";
import { OkatoRegion } from "../../../../shared/models/okato-region";
import { OkatoService } from "../../../../shared/services/okpd2.service";
import Create = PriceOrderActions.Create;
import { TextMaskConfig } from "angular2-text-mask/src/angular2TextMask";
import * as moment from "moment";
import { CartActions } from "../../actions/cart.actions";
import { CartState } from "../../states/cart.state";
import { KimPriceOrderPosition } from "../../../common/models/kim-price-order-position";
import CreatePriceOrder = CartActions.CreatePriceOrder;
import { Okpd2Item } from "../../../../core/models/okpd2-item";
import { OkeiService } from "../../../../shared/services/okei.service";
import { Okei } from "../../../../shared/models/okei";
import { ToastActions } from "../../../../shared/actions/toast.actions";
import { Router } from "@angular/router";
import { shareReplay, takeUntil } from "rxjs/operators";

@Component({
  selector: 'app-kim-price-order-form',
  templateUrl: './price-order-form.component.html',
  styleUrls: ['./price-order-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class PriceOrderFormComponent implements OnInit, OnDestroy {
  @Select(CartState.cartItems) orderPositions$: Observable<KimPriceOrderPosition[]>;
  @Input() cartView = false;
  @Output() close = new EventEmitter();
  form: FormGroup;
  regions$: Observable<OkatoRegion[]>;
  okpd2List$: Observable<Okpd2Item[]>;
  searchOkpd2 = (query, items: Okpd2Item[]) => items.filter(item => item.name.toLowerCase().indexOf(query.toLowerCase()) >= 0 ||
    item.code === query).slice(0, 20);
  readonly paymentTermsLabels = Object.entries(PaymentTermsLabels);
  readonly typeLabels = Object.entries(KimPriceOrderTypeLabels);
  readonly mask: TextMaskConfig = {
    mask: value => [/[0-2]/, value[0] === "2" ? /[0-3]/ : /[0-9]/, ' ', ':', ' ', /[0-5]/, /\d/],
    guide: false,
    keepCharPositions: true
  };
  readonly getRegionName = ({ name }) => name;
  readonly searchRegions = (query: string, items: OkatoRegion[]) => {
    return items.filter(item => item.name.toLowerCase().indexOf(query.toLowerCase()) >= 0);
  }
  readonly okeiList$ = this.okeiService.getOkeiList().pipe(shareReplay(1));
  readonly destroy$ = new Subject();

  get formPositions() {
    return this.form.get('positions') as FormArray;
  }

  constructor(private fb: FormBuilder,
              private store: Store,
              private okatoService: OkatoService,
              private okeiService: OkeiService,
              private router: Router) { }

  ngOnInit() {
    this.okpd2List$ = this.okatoService.getOkpd2();
    this.form = this.fb.group({
      id: null,
      name: ["", Validators.required],
      regions: ["", Validators.required],
      deliveryAddress: ["", Validators.required],
      deliveryConditions: ["", Validators.required],
      dateResponse: ["", [Validators.required]],
      dateDelivery: ["", Validators.required],
      type: [KimPriceOrderType.STANDART, Validators.required],
      isForSmallBusiness: false,
      isForProducer: false,
      isForAuthorizedDealer: false,
      isRussianProduction: false,
      isDenyMaxPricePosition: false,
      positions: this.fb.array([])
    });

    this.form.get('type').disable();
    this.regions$ = this.okatoService.getRegions();
    if (!this.cartView) {
      this.pushPosition();
      this.form.get('positions').setValidators([Validators.required]);
    }
  }

  pushPosition() {
    this.formPositions.push(this.fb.group({
      name: ["", Validators.required],
      quantity: ["", [Validators.required, Validators.pattern("^[0-9]+$"), Validators.min(1)]],
      okei: ["", Validators.required],
      okpd2: ["", Validators.required],
      maxPrice: ["", [Validators.required, Validators.pattern("^[0-9]+$"), Validators.min(1)]]
    }));
  }

  submit(orderPositions?: KimPriceOrderPosition[]) {
    const body: Partial<KimPriceOrder> & { id: Uuid } = this.form.value;
    body.dateResponse = moment(body.dateResponse, "DD.MM.YYYY HH:mm").toISOString();
    body.regions = this.form.value.regions.code;
    if (this.cartView) {
      body.positions = orderPositions;
      this.store.dispatch(new CreatePriceOrder(body))
        .pipe(takeUntil(this.destroy$))
        .subscribe(
        (result) => {
          const count = orderPositions.length;
          this.store.dispatch(new ToastActions.Success('Создан ценовой запрос по ' + count + ' позициям'));
          this.router.navigate(["kim/customer/price-orders"]);
        }
      );
      this.close.emit();
    } else {
      body.positions = this.form.get('positions').value;
      this.store.dispatch(new Create(body))
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (result) => {
            const count = this.form.value.positions.length;
            this.store.dispatch(new ToastActions.Success('Создан ценовой запрос по ' + count + ' позициям'));
            this.router.navigate(["kim/customer/price-orders"]);
          }
      );
    }
  }

  isDateResponseValid(date: Date) {
    let ammount = 3;
    for (let i = 1; i <= 3; i++) {
      // Не учитываем выходные дни
      if (["0", "6"].includes(moment().add(i, 'd').format("d"))) { ammount++; }
    }
    return !moment().add(ammount, "d").startOf('day').isSameOrBefore(date);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
