import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Store } from "@ngxs/store";
import { KimRequestActions } from "../../actions/kim-price-order.actions";
import Fetch = KimRequestActions.Fetch;
import { animate, style, transition, trigger } from "@angular/animations";

@Component({
  templateUrl: './kim-price-order-list.component.html',
  styleUrls: ['./kim-price-order-list.component.scss'],
  animations: [trigger('formHide', [transition(':leave', animate('200ms ease', style({ transform: 'scaleY(0)' })))])],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class KimPriceOrderListComponent implements OnInit {
  showForm = true;
  showFilter = false;
  constructor(private store: Store) { }

  ngOnInit() {
    this.store.dispatch(new Fetch());
  }

}
