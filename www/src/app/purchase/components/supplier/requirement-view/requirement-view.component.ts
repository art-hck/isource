import {Component, Directive, EventEmitter, OnChanges, OnInit, Output, ViewChild} from '@angular/core';
import { Uuid } from "../../../../cart/models/uuid";
import { SupplierPurchase } from "../../../models/supplier-purchase";
import { ActivatedRoute } from "@angular/router";
import { PurchasesSupplierStoreService } from "../../../services/purchases-supplier-store.service";
import { SupplierPurchaseItem } from '../../../models/supplier-purchase-item';
import { SupplierPurchaseLinkedItem } from '../../../models/supplier-purchase-linked-item';
import { SupplierPriceListItem } from '../../../models/supplier-price-list-item';
import { SelectProductComponent } from '../select-product/select-product.component';
import { LotWorkflowSteps } from '../../../enums/lot-workflow-steps';
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';
import {SupplierRequirementDocumentService} from "../../../services/supplier-requirement-document.service";
import { AttachedFile } from "../../../models/attached-file";

@Component({
  selector: 'app-customer-requirement-view',
  templateUrl: './requirement-view.component.html',
  styleUrls: ['./requirement-view.component.css']
})


export class RequirementViewComponent implements OnInit {

  @ViewChild(SelectProductComponent, { static: false }) protected selectProductComponent: SelectProductComponent;
  @Output() change = new EventEmitter<number>();

  protected purchaseId: Uuid;
  protected purchase: SupplierPurchase;
  protected purchaseItems: SupplierPurchaseItem[];

  protected deliveryCost = 0;

  protected selectedPurchaseItem: SupplierPurchaseItem;
  protected selectedPriceListItem: SupplierPriceListItem;

  protected showSelectProductComponent = false;

  constructor(
    protected purchasesStoreService: PurchasesSupplierStoreService,
    private route: ActivatedRoute,
    protected documentService: SupplierRequirementDocumentService
  ) {
  }

  ngOnInit() {
    this.purchaseId = this.route.snapshot.paramMap.get('id');

    this.purchasesStoreService.getPurchaseInfoForSupplier(this.purchaseId).subscribe(
      (purchase: SupplierPurchase) => {
        this.purchase = purchase;

        this.recalculateOfferCostByDeliveryCost(purchase.deliveryCost);
      }
    );

    this.purchasesStoreService.getPurchaseItems(this.purchaseId).subscribe(
      (purchaseItems: SupplierPurchaseItem[]) => {
        this.purchaseItems = purchaseItems;
      }
    );

    this.purchasesStoreService.changeSum.subscribe((offerCost: number) => {
      this.purchase.offerCost = offerCost;
    });

    this.purchasesStoreService.changeOfferCount.subscribe((offerCount: number) => {
      this.purchase.offerCount = offerCount;
    });

    this.documentService.init(this.purchaseId);
  }

  protected onChangeDeliveryCost(deliveryCost: number): void {
    this.purchasesStoreService.changeDeliveryCost(deliveryCost).subscribe(
      data => {
        this.recalculateOfferCostByDeliveryCost(deliveryCost);
      });
  }

  selectItemAsAnalog(selectedPriceListItem: SupplierPriceListItem): void {
    this.selectedPriceListItem = selectedPriceListItem;
    this.purchasesStoreService.mapPosition(
      this.selectedPriceListItem.id,
      this.selectedPurchaseItem.id,
      false
    ).subscribe(
      data => {
        const setItemAsAnalog = this.purchasesStoreService.setItemAsAnalogue(
          this.selectedPurchaseItem,
          selectedPriceListItem,
          data.id);
        if (setItemAsAnalog) {
          this.selectProductComponent.changeButtonsStatuses(selectedPriceListItem);
        }
      });
  }

  selectItemAsMain(selectedPriceListItem: SupplierPriceListItem) {
    this.selectedPriceListItem = selectedPriceListItem;
    this.purchasesStoreService.mapPosition(
      this.selectedPriceListItem.id,
      this.selectedPurchaseItem.id,
      true
    ).subscribe(
      data => {
        const setItemAsMain = this.purchasesStoreService.setItemAsMain(
          this.selectedPurchaseItem,
          selectedPriceListItem,
          data.id);
        if (setItemAsMain) {
          this.selectProductComponent.changeButtonsStatuses(selectedPriceListItem);
        }
      });
  }

  replyOnRequirement() {
    this.purchasesStoreService.replyOnRequirement(this.purchaseId);
  }

  protected canEditPurchase(): boolean {
    return this.purchase.lots[0].currentStep.type !== LotWorkflowSteps.ARCHIVE;
  }

  protected onChangeAvailability(event: {
    position: SupplierPurchaseItem,
    newValue: boolean
  }): void {
    this.purchasesStoreService.changeAvailableItem(this.purchaseId, event.position, event.newValue);
  }

  protected onChangeLinkedItemPriceValue(event: {
    position: SupplierPurchaseItem,
    linkedItem: SupplierPurchaseLinkedItem,
    newValue: number
  }): void {
    this.purchasesStoreService.changeLinkedItemPrice(event.position, event.linkedItem, event.newValue);
  }

  onClickAddLinkedItem(position: SupplierPurchaseItem) {
    this.selectedPurchaseItem = position;
    this.showSelectProductComponent = true;
  }

  protected onDeleteLinkedItem(event: {
    position: SupplierPurchaseItem,
    linkedItem: SupplierPurchaseLinkedItem
  }): void {
    this.purchasesStoreService.deleteLinkedItem(event.position, event.linkedItem);
  }

  protected recalculateOfferCostByDeliveryCost(deliveryCost: number): void {
    const delta = deliveryCost - this.deliveryCost;
    this.purchase.offerCost += delta;
    this.deliveryCost = deliveryCost;
  }

  canDeleteDocument(): boolean {
    return this.purchase.lots[0].currentStep.type === LotWorkflowSteps.OFFERS_GATHERING;
  }

  canUploadDocument(): boolean {
    return this.purchase.lots[0].currentStep.type === LotWorkflowSteps.OFFERS_GATHERING;
  }
}
