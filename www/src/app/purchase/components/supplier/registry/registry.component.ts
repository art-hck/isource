import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import { PurchasesSupplierStoreService } from '../../../services/purchases-supplier-store.service';
import { Router } from "@angular/router";
import { SupplierPurchase } from '../../../models/supplier-purchase';
import { CurrentStep } from 'src/app/purchase/models/current-step';
import { PurchaseWorkflowStepStatuses } from 'src/app/purchase/enums/purchase-workflow-step-statuses';
import { PurchaseTypes } from '../../../enums/purchase-types';

@Component({
  selector: 'app-supplier-registry',
  templateUrl: './registry.component.html',
  styleUrls: ['./registry.component.css']
})
export class RegistryComponent implements OnInit {

  @Output() changeType = new EventEmitter<any>();
  @Output() filterApply = new EventEmitter<any>();

  supplierPurchase: SupplierPurchase[];
  typeDataLoaded = false;
  filters = [];
  purchaseTypes = PurchaseTypes;

  constructor(
    protected supplierPurchaseStore: PurchasesSupplierStoreService,
    protected router: Router
  ) { }

  ngOnInit() {
    this.loadSupplierPurchase([]);
  }

  onChangeType(type) {
    this.updateFilter('purchaseType', type);
    this.loadSupplierPurchase(this.filters);
  }

  public async loadSupplierPurchase(filters) {
    this.typeDataLoaded = false;
    await this.supplierPurchaseStore.loadPage(filters);
    this.supplierPurchase = this.supplierPurchaseStore.getPurchasesList();
    this.typeDataLoaded = true;
  }

  onTitleClick(item: SupplierPurchase) {
    this.router.navigateByUrl(`/purchases/supplier/${item.type.toLowerCase()}/${item.id}/view`);
  }

  onFilterApply(filters) {
    const me = this;

    filters.forEach(function(e) {
      me.updateFilter(e.name, e.value);
    });

    this.loadSupplierPurchase(this.filters);
  }

  onFilterReset() {
    this.loadSupplierPurchase([]);
  }


  /**
   * Обвновляет массив в зависимости от условий (3 условия)
   */
  updateFilter(name, value): void {
    const index = this.filters.findIndex((e) => e.name === name);

    if (index !== -1) {
      if (value === '') {
        this.filters.splice(index, 1);
      } else {
        this.filters[index] = {name: name, value: value};
      }
    } else if (value !== '') {
      this.filters.push({name: name, value: value});
    }
  }

  getStateLabel(item: SupplierPurchase): string {
   return this.isStepTypeWithExpectedEndDate(item) ?
     item.lots[0].currentStep.label + ' до:' :
     '';
  }

  getStateDate(item: SupplierPurchase): Date|null {
    const currentStep = this.getSupplierPurchaseCurrentStep(item);
    return this.isStepTypeWithExpectedEndDate(item) ?
      currentStep.expectedEndDate :
      null;
  }

  getStartPriceColumnLabel(item: SupplierPurchase): string {
    if (item.type === PurchaseTypes.ORDER) {
      return 'Цена заказа';
    }
    return 'НМЦ';
  }

  protected getSupplierPurchaseCurrentStep(item: SupplierPurchase): CurrentStep|null {
    return (item.lots && item.lots.length > 0) ? item.lots[0].currentStep : null;
  }

  isStepTypeWithExpectedEndDate(item: SupplierPurchase): boolean {
    const currentStep = this.getSupplierPurchaseCurrentStep(item);
    return currentStep
      && (currentStep.type === PurchaseWorkflowStepStatuses.OFFERS_GATHERING
      || currentStep.type === PurchaseWorkflowStepStatuses.ON_SUPPLIER_APPROVAL
      || currentStep.type === PurchaseWorkflowStepStatuses.WINNER_PRICE_REDUCTION);
  }
}
