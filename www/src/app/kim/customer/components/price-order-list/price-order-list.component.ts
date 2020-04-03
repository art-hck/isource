import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Store } from "@ngxs/store";
import { PriceOrderActions } from "../../actions/price-order.actions";
import { animate, style, transition, trigger } from "@angular/animations";
import Fetch = PriceOrderActions.Fetch;

@Component({
  templateUrl: './price-order-list.component.html',
  styleUrls: ['./price-order-list.component.scss'],
  animations: [trigger('formHide', [transition(':leave', animate('200ms ease', style({ transform: 'scaleY(0)' })))])],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PriceOrderListComponent implements OnInit {
  showForm = true;
  showFilter = false;
  reviewTabCount = 0;
  progressTabCount = 0;
  reviewedTabCount = 0;
  constructor(private store: Store) { }

  ngOnInit() {
    this.store.dispatch(new Fetch());
  }

}
