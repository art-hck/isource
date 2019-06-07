import { Component, OnInit } from '@angular/core';
import { CustomerPurchase } from "../../../models/customer-purchase";
import { PurchasesCustomerStoreService } from "../../../services/purchases-customer-store.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Uuid } from "../../../../cart/models/uuid";
import { CustomerPurchaseItem } from "../../../models/customer-purchase-item";
import { SupplierOffer } from "../../../models/supplier-offer";
import { ClrDatagridStateInterface } from '@clr/angular';
import { Page } from "../../../../order/models/page";
import { LotWorkflowSteps } from "../../../enums/lot-workflow-steps";


@Component({
  selector: 'app-customer-requirement-view',
  templateUrl: './requirement-view.component.html',
  styleUrls: ['./requirement-view.component.css']
})
export class RequirementViewComponent implements OnInit {
  protected purchaseId: Uuid;
  protected purchase: CustomerPurchase;
  protected suppliersOffers: SupplierOffer[];

  positionsPage: Page<CustomerPurchaseItem>;
  positionsLoading = true;

  selectedSupplierOffer?: SupplierOffer;

  procedureCreated = false;
  procedureCreationAvailable = false;

  constructor(
    protected purchasesStoreService: PurchasesCustomerStoreService,
    private route: ActivatedRoute,
    protected router: Router
  ) {
  }

  ngOnInit() {
    this.purchaseId = this.route.snapshot.paramMap.get('id');

    // загружаем информацию по закупке
    this.purchasesStoreService.getPurchaseInfoForCustomer(this.purchaseId).subscribe(
      (purchase: CustomerPurchase) => {
        this.purchase = purchase;
        this.procedureCreationAvailable = this.canCreatedProcedure(purchase);
      }
    );

    // загружаем предложения поставщиков
    this.purchasesStoreService.getSuppliersOffers(this.purchaseId).subscribe(
      (suppliersOffers: SupplierOffer[]) => {
        this.suppliersOffers = suppliersOffers;
      }
    );
  }

  /**
   * Перезагружает грид с позициями
   *
   * @param state
   */
  onRefreshPositions(state: ClrDatagridStateInterface) {
    this.positionsLoading = true;

    this.purchasesStoreService
      .getPurchasePositionsInfoForCustomer(this.purchaseId, state)
      .subscribe((page: Page<CustomerPurchaseItem>) => {
        this.positionsPage = page;
        this.positionsLoading = false;
      });
  }

  onOfferClick(supplierOffer?: SupplierOffer): void {
    this.selectedSupplierOffer = supplierOffer;
  }

  /**
   * Обработчик кнопки "Создать процедуру"
   */
  createProcedure() {
    this.purchasesStoreService.sendCreatedProcedure(this.purchaseId).subscribe(
      () => {
        this.procedureCreated = true;
        this.procedureCreationAvailable = this.canCreatedProcedure(this.purchase);
      }
    );
  }

  /**
   * Обработчик кнопки "Перейти в созданную процедуру"
   */
  viewProcedure() {
    this.router.navigateByUrl(`purchases/customer/list`);
  }

  /**
   * Возвращает можно ли создать процедуру
   * @param purchase
   */
  protected canCreatedProcedure(purchase: CustomerPurchase): boolean {
    return purchase.lots[0].currentStep.type === LotWorkflowSteps.ARCHIVE && this.procedureCreated === false;
  }

}
