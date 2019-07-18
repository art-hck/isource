import { Component, OnInit, Input } from '@angular/core';
import { Supplier } from '../../models/supplier';
import { StoreService } from '../../services/store.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-cart-supplier',
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.css']
})
export class SupplierComponent implements OnInit {

  @Input() supplier: Supplier;

  orderDisplay = 'none';
  sumBlockDisplay = 'block';

  constructor(
    protected store: StoreService,
    protected http: HttpClient
  ) { }

  ngOnInit() {
  }

  async onDeleteAllItems(supplier: Supplier): Promise<boolean> {
    return this.store.deleteSupplier(supplier);
  }

  /**
   * Переключение состояний видимости блоков суммы заказа и формы оформления заказа
   */
  onOrderButtonClick() {
    if (this.orderDisplay === 'none') {
      this.orderDisplay = 'block';
      this.sumBlockDisplay = 'none';
    } else {
      this.orderDisplay = 'none';
      this.sumBlockDisplay = 'block';
    }
  }

}
