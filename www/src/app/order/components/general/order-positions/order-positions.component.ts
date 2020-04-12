import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { OrdersStoreService } from "../../../services/orders-store.service";
import { Page } from "../../../models/page";
import { OrderPosition } from "../../../models/order-position";
import { Order } from "../../../models/order";
import { PositionSupplierResponseTypes } from "../../../enums/position-supplier-response-types";
import { PaginatorComponent } from "../../paginator/paginator.component";
import { OrderCost } from "../../../models/order-cost";
import { PositionSupplierResponseTypeNames } from "../../../dictinaries/position-supplier-response-type-names";

@Component({
  selector: 'app-order-positions',
  templateUrl: './order-positions.component.html',
  styleUrls: ['./order-positions.component.css']
})
export class OrderPositionsComponent implements AfterViewInit, OnInit {

  @Input() order: Order;

  /**
   * Определяет доступен ли статус ответа поставщика для редактирования
   */
  @Input() supplierResponseReadOnly: boolean;

  @ViewChild(PaginatorComponent) paginator: PaginatorComponent;

  pageSize = 25;
  positions: Page<OrderPosition>;
  positionSupplierResponseTypes = PositionSupplierResponseTypes;
  positionSupplierResponseTypeNames = PositionSupplierResponseTypeNames;

  constructor(
    private ordersStore: OrdersStoreService
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.loadOrderPositions();
  }

  public loadOrderPositions() {
    this.ordersStore.getOrderPositions(this.order.id, this.paginator.page, this.paginator.pageSize)
      .subscribe(
        (positions: Page<OrderPosition>) => {
          this.positions = positions;
        }
      );
  }

  onPositionResponseTypeChange(position, responseType) {
    this.ordersStore.setSinglePositionResponseType(this.order, position, responseType)
      .subscribe((orderCost: OrderCost)  => {
        this.order.setOrderCost(orderCost);
      });
  }

  /**
   * Очищает текущие загруженные позиции.
   */
  public clearPositions() {
    this.positions.entities.length = 0;
  }

  onChangePage() {
    this.loadOrderPositions();
  }
}
