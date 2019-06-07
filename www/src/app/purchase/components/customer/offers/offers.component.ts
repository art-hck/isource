import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {ClrDatagridSortOrder} from '@clr/angular';
import { SupplierOffer } from "../../../models/supplier-offer";
import { Purchase } from "../../../models/purchase";
import {PurchaseWorkflowStepStatuses} from "../../../enums/purchase-workflow-step-statuses";

/**
 * Блок предложений поставщиков
 */
@Component({
  selector: 'app-purchase-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.css']
})
export class OffersComponent implements OnInit {

  @Input() purchase: Purchase;
  @Input() suppliersOffers: SupplierOffer[];
  @Output() offerClick = new EventEmitter<SupplierOffer>();

  ascSort = ClrDatagridSortOrder.ASC;
  pageSize = 10;
  selectedSupplierOffer?: SupplierOffer;
  pricesWithVAT = true;

  constructor() {
  }

  ngOnInit() {
  }

  onOfferClick(supplierOffer?: SupplierOffer): void {
    this.offerClick.emit(supplierOffer ? supplierOffer : null);
  }

  protected getOfferCostFieldClass(supplierOffer: SupplierOffer): { [key: string]: true } {
    if (this.checkOfferPositionsCount(supplierOffer)) {
      return {};
    }
    if (supplierOffer.offerCostWithVat > this.purchase.lots[0].startMaxCost) {
      return { 'red-text': true };
    } else if (supplierOffer.isMinOfferCost) {
      return { 'green-text': true };
    }
    return {};
  }

  protected checkOfferPositionsCount(supplierOffer: SupplierOffer): boolean {
    return supplierOffer.positionsCount < this.purchase.positionsCount;
  }

  getStartMaxCost(): number | null {
    if (!this.purchase || !this.purchase.lots || this.purchase.lots.length === 0) {
      return null;
    }
    return this.purchase.lots[0].startMaxCost;
  }

  /**
   * Функция проверяет, видит ли заказчик колонку «Место» в списке участников для текущего статуса процедуры
   */
  canSeePlaceColumn(): boolean {
    if (!this.purchase || !this.purchase.lots || this.purchase.lots.length === 0) {
      return false;
    }
    const lot = this.purchase.lots[0];
    const statuses: string[] = [
      PurchaseWorkflowStepStatuses.PRICE_REDUCTION,
      PurchaseWorkflowStepStatuses.WINNER_PRICE_REDUCTION,
      PurchaseWorkflowStepStatuses.WINNER_CHOICE
    ];
    return (statuses.indexOf(lot.currentStep.type) >= 0);
  }

  getVATLabel() {
    return this.pricesWithVAT ? 'с НДС' : 'без НДС';
  }

}
