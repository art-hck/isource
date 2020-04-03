import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Select, Store } from "@ngxs/store";
import { PriceOrderActions } from "../../actions/price-order.actions";
import { animate, style, transition, trigger } from "@angular/animations";
import Fetch = PriceOrderActions.Fetch;
import { KimPriceOrder } from "../../../common/models/kim-price-order";
import { PriceOrderState } from "../../states/price-order.state";
import { Observable } from "rxjs";
import { StateStatus } from "../../../../request/common/models/state-status";

@Component({
  templateUrl: './price-order-list.component.html',
  styleUrls: ['./price-order-list.component.scss'],
  animations: [trigger('formHide', [transition(':leave', animate('200ms ease', style({ transform: 'scaleY(0)' })))])],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PriceOrderListComponent implements OnInit {
  @Select(PriceOrderState.priceOrders) priceOrders$: Observable<KimPriceOrder[]>;
  @Select(PriceOrderState.priceOrdersLength) priceOrdersLength$: Observable<number>;
  @Select(PriceOrderState.status) status$: Observable<StateStatus>;
  showForm = false;
  showFilter = false;
  reviewTabCount = 0;
  progressTabCount = 0;
  reviewedTabCount = 0;
  getOrderId = (i, {id}: KimPriceOrder) => id;
  constructor(private store: Store) { }

  ngOnInit() {
    this.store.dispatch(new Fetch());
  }

}
