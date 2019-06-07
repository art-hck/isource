import { Component, OnInit } from '@angular/core';
import {CustomerOrder} from "../../../models/customer-order";
import {Uuid} from "../../../../cart/models/uuid";
import {ActivatedRoute} from "@angular/router";
import {OrderCustomerService} from "../../../services/customer-order.service";
import {Page} from "../../../../order/models/page";
import {SupplierPurchaseItem} from "../../../models/supplier-purchase-item";
import { CustomerOrderDocumentService } from "../../../services/customer-order-document.service";
import {LotWorkflowSteps} from "../../../enums/lot-workflow-steps";

@Component({
  selector: 'app-purchase-customer-order-view',
  templateUrl: './order-view.component.html',
  styleUrls: ['./order-view.component.css']
})
export class OrderViewComponent implements OnInit {

  /** Свойство-флаг, определяющее, отображается ли модальное окно */
  supplierDocumentSignDeadlineOpen = false;

  purchaseId: Uuid;
  purchase: CustomerOrder;

  positionsData: Page<SupplierPurchaseItem>;
  positionsLoading = true;

  documentSentForSupplierSigning = false;

  constructor(
    protected orderCustomerService: OrderCustomerService,
    private route: ActivatedRoute,
    protected documentService: CustomerOrderDocumentService
  ) { }

  ngOnInit() {
    this.purchaseId = this.route.snapshot.paramMap.get('id');
    this.documentService.init(this.purchaseId);

    // Загружаем информацию о заказе
    this.updateOrderInfo();

    // Загружаем список позиций
    this.orderCustomerService.getOrderPositions(this.purchaseId).subscribe(
      (pagePositions: Page<SupplierPurchaseItem>) => {
        this.positionsData = pagePositions;
        this.positionsLoading = false;
      });
  }


  // Загрузка информации о заказе
  updateOrderInfo() {
    this.orderCustomerService.getOrderInfo(this.purchaseId).subscribe(
      (purchase: CustomerOrder) => {
        this.purchase = purchase;
      }
    );
  }


  // Проверка для отображения кнопки «Подписать»
  canSignDocument(): boolean {
    return this.purchase.lots[0].currentStep.type === LotWorkflowSteps.ON_CUSTOMER_APPROVAL
      && this.purchase.contractIsSignedByCustomer === false
      && this.purchase.contracts.length > 0;
  }


  // Проверка для отображения нотификации «Договор подписан»
  isSignedDocument(): boolean {
    return this.purchase.contractIsSignedByCustomer === true || this.documentSentForSupplierSigning === true;
  }


  // Действие при подписывании документа
  onDocumentSign() {
    this.supplierDocumentSignDeadlineOpen = true;
  }


  onCreateDocumentSignDeadline(signingDeadlineDate: string) {
    this.orderCustomerService.signDocument(this.purchaseId, signingDeadlineDate).subscribe(
      () => {
        this.documentSentForSupplierSigning = true;
        this.supplierDocumentSignDeadlineOpen = false;
        this.updateOrderInfo();
      },
      () => {
        throw new Error('Не удалось подписать документ');
      }
    );
  }

  uploadContract() {
    this.documentService.onFileSelected().subscribe(
      () => {
        this.updateOrderInfo();
      },
    );
  }

}
