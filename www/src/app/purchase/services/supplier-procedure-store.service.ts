import { Injectable } from '@angular/core';
import { SupplierProcedureService } from './supplier-procedure.service';
import { Uuid } from 'src/app/cart/models/uuid';
import { SupplierPurchase } from '../models/supplier-purchase';
import { Page } from 'src/app/order/models/page';
import { PurchaseProtocol } from '../models/purchase-protocol';
import { PurchaseNoticeItem } from '../models/purchase-notice-item';
import { SupplierPurchaseItem } from '../models/supplier-purchase-item';
import { SupplierPurchaseLinkedItem } from '../models/supplier-purchase-linked-item';
import { PurchaseWorkflowStepStatuses } from '../enums/purchase-workflow-step-statuses';
import {HttpClient} from "@angular/common/http";

@Injectable()
export class SupplierProcedureStoreService {


  protected purchaseInfo?: SupplierPurchase;
  purchaseId: Uuid;

  infoData: SupplierPurchase;
  positionsData: Page<SupplierPurchaseItem>;
  noticeData: PurchaseNoticeItem[];
  protocolsData: PurchaseProtocol[];
  deliveryCost = 0;

  positionsLoading = true;
  editablePricesMode = false;

  constructor(
    protected procedureService: SupplierProcedureService,
    protected api: HttpClient
  ) { }

  loadData(purchaseId: Uuid): void {
    this.purchaseId = purchaseId;

    this.procedureService.getProcedureInfo(this.purchaseId).subscribe((data: SupplierPurchase) => {
      this.infoData = data;
      this.deliveryCost = data.deliveryCost;
      if (!data.lots || data.lots.length === 0) {
        return;
      }
      const lot = data.lots[0];
      if ((lot.currentStep.type === PurchaseWorkflowStepStatuses.WINNER_PRICE_REDUCTION && data.isWinner === true)
        || lot.currentStep.type === PurchaseWorkflowStepStatuses.PRICE_REDUCTION) {
        this.editablePricesMode = true;
      }
    });

    this.procedureService.getProcedurePositions(this.purchaseId).subscribe((pagePositions: Page<SupplierPurchaseItem>) => {
      this.positionsData = pagePositions;
      this.positionsLoading = false;
      this.updateMainLinkedItems();
    });

    this.procedureService.getNotice(this.purchaseId).subscribe((data: PurchaseNoticeItem[]) => {
      this.noticeData = data;
    });

    this.procedureService.getProtocols(this.purchaseId).subscribe((data: PurchaseProtocol[]) => {
      this.protocolsData = data;
    });
  }

  /**
   * Обработка изменения цены позиции
   *
   * Выполняет проверку превышения цены предложения. Если ок, то отправка данных на бек, иначе возврат старых значений.
   *
   * Метод возвращает новую цену, если всё ок, иначе возвращает старую цену позиции.
   *
   * @param linkedItem
   * @param newPrice
   */
  async updatePrice(linkedItem: SupplierPurchaseLinkedItem, newPrice: number): Promise<number> {
    const oldPrice = linkedItem.price;
    const item = this.getItemByLinkedItem(linkedItem);
    const delta = (newPrice - oldPrice) * item.quantity;

    if (!this.checkStartMaxCost(delta) || newPrice <= 0) {
      return oldPrice;
    }
    linkedItem.price = newPrice;
    this.infoData.offerCost += delta;

    const resp = await this.procedureService.sendPrice(this.purchaseId, linkedItem, newPrice).toPromise();
    if (!resp.success) {
      this.revertData(linkedItem, oldPrice, delta);
      return oldPrice;
    }
    return newPrice;
  }

  protected updateMainLinkedItems(): void {
    for (const item of this.positionsData.entities) {
      if (!item.linkedItems || item.linkedItems.length === 0) {
        continue;
      }
      item.mainLinkedItem = item.linkedItems[0];
    }
  }

  protected getItemByLinkedItem(item: SupplierPurchaseLinkedItem): SupplierPurchaseItem|null {
    for (const procedureItem of this.positionsData.entities) {
      if (!procedureItem.linkedItems) {
        continue;
      }
      for (const linkedItem of procedureItem.linkedItems) {
        if (linkedItem.id === item.id) {
          return procedureItem;
        }
      }
    }
    return null;
  }

  protected checkStartMaxCost(delta: number): boolean {
    const offerCost = this.infoData.offerCost + delta;
    if (!this.infoData.lots || this.infoData.lots.length === 0) {
      return false;
    }
    return (offerCost <= this.infoData.lots[0].startMaxCost);
  }

  /**
   * Откат значений на старые после неудачного сохранения данных на беке
   *
   * @param linkedItem
   * @param oldPrice
   * @param delta
   */
  protected revertData(
    linkedItem: SupplierPurchaseLinkedItem,
    oldPrice: number,
    delta: number
  ): void {
    linkedItem.price = oldPrice;
    this.infoData.offerCost -= delta;
  }

  changeDeliveryCost(deliveryCost: number) {
    return this.api.post(
      `purchases/supplier/${this.infoData.id}/change-delivery-cost`,
      {deliveryCost: deliveryCost}
    );
  }
}
