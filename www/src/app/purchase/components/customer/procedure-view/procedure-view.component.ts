import { Component, OnInit } from '@angular/core';
import { CustomerPurchase } from "../../../models/customer-purchase";
import { ActivatedRoute, Router } from "@angular/router";
import { Uuid } from "../../../../cart/models/uuid";
import { ProcedureCustomerService } from "../../../services/customer-procedure.service";
import { SupplierOffer } from "../../../models/supplier-offer";
import { CustomerPurchaseItem } from "../../../models/customer-purchase-item";
import { ClrDatagridStateInterface } from '@clr/angular';
import { Page } from "../../../../order/models/page";
import { PurchaseNoticeItem } from "../../../models/purchase-notice-item";
import { PurchaseProtocol } from "../../../models/purchase-protocol";
import { LotWorkflowSteps } from "../../../enums/lot-workflow-steps";
import { PurchaseWinnerInfo } from "../../../models/purchase-winner-info";
import { PurchasesCustomerStoreService } from "../../../services/purchases-customer-store.service";
import { CustomerDocumentService } from "../../../services/customer-document.service";

@Component({
  selector: 'app-customer-procedure-view',
  templateUrl: './procedure-view.component.html',
  styleUrls: ['./procedure-view.component.css']
})
export class ProcedureViewComponent implements OnInit {
  priceReductionModalOpen = false;

  purchaseId: Uuid;
  purchase: CustomerPurchase;

  positionsLoading = true;
  positionsPage: Page<CustomerPurchaseItem>;

  suppliersOffers: SupplierOffer[];
  selectedSupplierOffer?: SupplierOffer;

  procedureNotice: PurchaseNoticeItem[];
  procedureProtocols: PurchaseProtocol[];
  procedureWinnerInfo?: PurchaseWinnerInfo;

  requestPriceReductionCreated = false;
  requestPriceReductionToWinnerCreated = false;

  orderCreated = false;

  constructor(
    protected procedureCustomerService: ProcedureCustomerService,
    protected purchasesStoreService: PurchasesCustomerStoreService,
    protected documentService: CustomerDocumentService,
    private route: ActivatedRoute,
    protected router: Router
  ) {
  }

  ngOnInit() {
    this.purchaseId = this.route.snapshot.paramMap.get('id');

    // загружаем информацию по закупке
    this.procedureCustomerService.getProcedureInfo(this.purchaseId).subscribe(
      (purchase: CustomerPurchase) => {
        this.purchase = purchase;

        // загружаем данные о победителе
        this.getProcedureWinnerInfo();
      }
    );

    // загружаем предложения поставщиков
    this.procedureCustomerService.getSuppliersOffers(this.purchaseId).subscribe(
      (suppliersOffers: SupplierOffer[]) => {
        this.suppliersOffers = suppliersOffers;
      }
    );

    // загружаем извещение
    // todo возможно его лучше получать в одном запросе с общей информацией
    this.procedureCustomerService.getNotice(this.purchaseId).subscribe(
      (notice: PurchaseNoticeItem[]) => {
        this.procedureNotice = notice;
      }
    );

    // загружаем извещение
    // todo также возможно его лучше получать в одном запросе с общей информацией
    this.procedureCustomerService.getProtocols(this.purchaseId).subscribe(
      (protocols: PurchaseProtocol[]) => {
        this.procedureProtocols = protocols;
      }
    );
    this.documentService.init(this.purchaseId);
  }

  /**
   * Перезагружает грид с позициями
   *
   * @param state
   */
  onRefreshPositions(state: ClrDatagridStateInterface) {
    this.positionsLoading = true;

    this.procedureCustomerService
      .getProcedurePositions(this.purchaseId, state)
      .subscribe((page: Page<CustomerPurchaseItem>) => {
        this.positionsPage = page;
        this.positionsLoading = false;
      });
  }

  onOfferClick(supplierOffer?: SupplierOffer): void {
    this.selectedSupplierOffer = supplierOffer;
  }

  canRequestPriceReduction(): boolean {
    return this.purchase.lots[0].currentStep.type === LotWorkflowSteps.PUBLISHED;
  }

  canRequestPriceReductionToWinner(): boolean {
    return this.purchase.lots[0].currentStep.type === LotWorkflowSteps.WINNER_CHOICE;
  }

  canGetProcedureWinnerInfo(): boolean {
    const lot = this.purchase.lots[0];
    const winnerStatuses: string[] = [
      LotWorkflowSteps.WINNER_CHOICE,
      LotWorkflowSteps.WINNER_PRICE_REDUCTION,
      LotWorkflowSteps.WAITING_FOR_RESULTS_PROTOCOL
    ];
    return winnerStatuses.indexOf(lot.currentStep.type) >= 0;
  }

  canCreateOrder(): boolean {
    return this.purchase.lots[0].currentStep.type === LotWorkflowSteps.WAITING_FOR_RESULTS_PROTOCOL
      && this.procedureWinnerInfo
      && this.procedureWinnerInfo.beneficiariesDocuments.resolution === true;
  }

  canSeeProcedureWinnerInfo(): boolean {
    return this.canGetProcedureWinnerInfo() && this.procedureWinnerInfo instanceof Object;
  }


  protected getProcedureWinnerInfo() {
    if (this.canGetProcedureWinnerInfo()) {
      this.procedureCustomerService.getWinnerInfo(this.purchaseId).subscribe(
        (info: PurchaseWinnerInfo) => {
          this.procedureWinnerInfo = info;
        }
      );
    }
  }


  protected updateProcedureInfo(purchaseId: Uuid) {
    this.procedureCustomerService.getProcedureInfo(this.purchaseId).subscribe(
      (purchase: CustomerPurchase) => {
        this.purchase = purchase;
      }
    );
  }

  /**
   * Обработчик модального окна отправки запроса понижения цены
   */
  onPriceReductionClick(): void {
    this.priceReductionModalOpen = true;
  }

  /**
   * Обработчик кнопки "Отправить" в модальном окне
   */
  onCreateRequestPriceReduction(requestPriceReductionEndDate: string) {
    this.procedureCustomerService.sendProcedureRequestPriceReduction(this.purchaseId, requestPriceReductionEndDate)
      .subscribe(() => {
        this.updateProcedureInfo(this.purchaseId);
        this.requestPriceReductionCreated = true;
      }
    );
    this.priceReductionModalOpen = false;
  }

  onCreateRequestPriceReductionToWinner(requestPriceReductionEndDate: string) {
    this.procedureCustomerService.sendProcedureRequestPriceReductionToWinner(this.purchaseId, requestPriceReductionEndDate)
      .subscribe(() => {
        this.updateProcedureInfo(this.purchaseId);
        this.requestPriceReductionToWinnerCreated = true;
      }
    );
    this.priceReductionModalOpen = false;
  }


  onAcceptDocument() {
    this.procedureCustomerService.setBeneficiaryDocumentResolution(this.purchaseId, true).subscribe(
      () => {
        this.procedureWinnerInfo.beneficiariesDocuments.resolution = true;
        this.getProcedureWinnerInfo();
      }, () => {
        this.procedureWinnerInfo.beneficiariesDocuments.resolution = null;
        throw new Error('Не удалось вынести решение по документу');
      }
    );
  }

  onDeclineDocument() {
    this.procedureCustomerService.setBeneficiaryDocumentResolution(this.purchaseId, false).subscribe(
      () => {
        this.procedureWinnerInfo.beneficiariesDocuments.resolution = false;
        this.procedureCustomerService.getProcedureInfo(this.purchaseId);
      }, () => {
        this.procedureWinnerInfo.beneficiariesDocuments.resolution = null;
        throw new Error('Не удалось вынести решение по документу');
      }
    );
  }

  /**
   * Обработчик кнопки "Создать заказ"
   */
  createOrder() {
    this.purchasesStoreService.createOrder(this.purchaseId).subscribe(
      () => {
        this.orderCreated = true;
      }
    );
  }
  /**
   * Обработчик кнопки "Перейти в созданный заказ"
   */
  viewOrder() {
    this.router.navigateByUrl(`purchases/customer/list`);
  }
}
