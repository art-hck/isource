import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Store } from "@ngxs/store";
import { KimRequestActions } from "../../actions/kim-price-order.actions";
import Fetch = KimRequestActions.Fetch;

@Component({
  templateUrl: './kim-price-order-list.component.html',
  styleUrls: ['./kim-price-order-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class KimPriceOrderListComponent implements OnInit {
  showForm = true;
  constructor(private store: Store) { }

  ngOnInit() {
    this.store.dispatch(new Fetch());
  }

}
