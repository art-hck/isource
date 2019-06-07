import { Component, OnInit, ViewChild } from '@angular/core';
import { OrdersStoreService } from "../../../services/orders-store.service";
import {ActivatedRoute, Router} from "@angular/router";
import { Order } from "../../../models/order";
import { OrderPositionsComponent } from "../../general/order-positions/order-positions.component";
import { ClrLoadingState } from '@clr/angular';
import { PositionSupplierResponseTypes } from "../../../enums/position-supplier-response-types";
import { OrderCost } from "../../../models/order-cost";
import { SupplierButtonProfileTypes } from '../../../dictinaries/supplier-button-profile-types';
import { ButtonsProfiles } from '../../../enums/buttons-profiles';

@Component({
  selector: 'app-supplier-order-confirmation',
  templateUrl: './supplier-order-confirmation.component.html',
  styleUrls: ['./supplier-order-confirmation.component.css']
})
export class SupplierOrderConfirmationComponent implements OnInit {

  @ViewChild(OrderPositionsComponent, { static: false })
  private orderPositionsComponent: OrderPositionsComponent;

  positionsResponseTypeBtnState: ClrLoadingState = ClrLoadingState.DEFAULT;
  positionSupplierResponseTypes = PositionSupplierResponseTypes;

  order: Order;

  constructor(
    private route: ActivatedRoute,
    private ordersStore: OrdersStoreService,
    protected router: Router
  ) { }

  ngOnInit() {
    this.loadOrderInfo();
  }

  protected async loadOrderInfo() {
    const id = this.route.snapshot.paramMap.get('id');
    await this.ordersStore.getOrderInfoForSupplier(id).then((order: Order) => {
      this.order = order;
    });
  }

  onSendOrder() {
    this.ordersStore
      .sendOrder(this.order)
      .subscribe(() => {
        this.router.navigateByUrl('orders/incoming');
        alert('Заказ отправлен');
      });
  }

  onAllPositionsResponseTypeClick(responseType: string) {
    this.positionsResponseTypeBtnState = ClrLoadingState.LOADING;

    this.ordersStore
      .setAllPositionResponseType(this.order, responseType)
      .subscribe((orderCost: OrderCost) => {
        this.positionsResponseTypeBtnState = ClrLoadingState.SUCCESS;

        this.order.setOrderCost(orderCost);
        this.orderPositionsComponent.clearPositions();
        this.orderPositionsComponent.loadOrderPositions();
      });
  }

  getButtonsProfile(): string {
    const status = this.order.currentStatus.type;
    if (status in SupplierButtonProfileTypes) {
      return SupplierButtonProfileTypes[status];
    }
    return ButtonsProfiles.EMPTY;
  }
}
