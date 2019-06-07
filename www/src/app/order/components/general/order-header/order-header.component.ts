import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Order } from "../../../models/order";
import { ButtonsProfiles } from '../../../enums/buttons-profiles';
import { CustomerResolutionTypes } from '../../../enums/customer-resolution-types';

@Component({
  selector: 'app-order-header',
  templateUrl: './order-header.component.html',
  styleUrls: ['./order-header.component.css']
})
export class OrderHeaderComponent implements OnInit {

  @Input() order: Order;
  @Input() contragentLabel: string;
  @Input() contragentFullName: string;
  @Input() buttonsProfile = '';

  @Output() sendOrderClick = new EventEmitter();

  buttonsProfiles = ButtonsProfiles;
  customerResolutionTypes = CustomerResolutionTypes;

  constructor() {
  }

  ngOnInit() {
  }

  onSendOrder(response: string|null) {
    if (!this.order.positionsCostWithVat) {
      alert('Нулевая стоимость заказа');
      return false;
    }
    this.sendOrderClick.emit(response);
  }
}
