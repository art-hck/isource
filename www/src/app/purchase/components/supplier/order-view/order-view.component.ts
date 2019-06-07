import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { Uuid } from "../../../../cart/models/uuid";
import { SupplierOrderService } from "../../../services/supplier-order.service";
import { Page } from "../../../../order/models/page";
import { SupplierPurchaseItem } from "../../../models/supplier-purchase-item";
import { LotWorkflowSteps } from "../../../enums/lot-workflow-steps";
import { SupplierOrder } from "../../../models/supplier-order";
import { SupplierDocumentService } from "../../../services/supplier-document.service";

@Component({
  selector: 'app-purchase-supplier-order-view',
  templateUrl: './order-view.component.html',
  styleUrls: ['./order-view.component.css']
})
export class OrderViewComponent implements OnInit {

  purchaseId: Uuid;
  order: SupplierOrder;

  positionsData: Page<SupplierPurchaseItem>;
  positionsLoading = true;

  signedContract = false;

  constructor(
    private route: ActivatedRoute,
    protected orderService: SupplierOrderService,
    protected documentService: SupplierDocumentService
  ) { }

  ngOnInit() {
    this.purchaseId = this.route.snapshot.paramMap.get('id');

    // загружаем информацию по заказу
    this.updateOrderInfo();

    // загружаем список позиций
    this.orderService.getOrderPositions(this.purchaseId).subscribe(
      (pagePositions: Page<SupplierPurchaseItem>) => {
        this.positionsData = pagePositions;
        this.positionsLoading = false;
      });
    this.documentService.init(this.purchaseId);
  }

  // проверка для отображения кнопки "Подписать"
  canSignContract(): boolean {
    return this.order.lots[0].currentStep.type === LotWorkflowSteps.ON_SUPPLIER_APPROVAL
    && this.order.contractIsSignedBySupplier === false;
  }

  // проверка для отображения нотификации "Договор подписан"
  isSignedContract(): boolean {
    return this.order.contractIsSignedBySupplier === true || this.signedContract === true;
  }

  protected updateOrderInfo() {
    this.orderService.getOrderInfo(this.purchaseId).subscribe(
      (order: SupplierOrder) => {
        this.order = order;
      });
  }

  signContract(): void {
    this.orderService.signContract(this.purchaseId).subscribe(
      () => {
       this.updateOrderInfo();
       this.signedContract = true;
      }, () => {
        throw new Error('Не удалось подписать договор');
      }
    );
  }
}
