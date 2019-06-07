import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import { PurchasesCustomerStoreService } from '../../../services/purchases-customer-store.service';
import { Router } from "@angular/router";
import { CustomerPurchase } from '../../../models/customer-purchase';
import { PurchaseWorkflowStepStatuses } from 'src/app/purchase/enums/purchase-workflow-step-statuses';
import { CurrentStep } from "../../../models/current-step";
import {PurchaseTypes} from "../../../enums/purchase-types";

@Component({
  selector: 'app-customer-registry',
  templateUrl: './registry.component.html',
  styleUrls: ['./registry.component.css']
})
export class RegistryComponent implements OnInit {

  @Output() changeType = new EventEmitter<any>();
  @Output() filterApply = new EventEmitter<any>();

  customerPurchase: CustomerPurchase[];
  typeDataLoaded = false;
  filters = [];
  purchaseTypes = PurchaseTypes;

  constructor(
    protected customerPurchaseStore: PurchasesCustomerStoreService,
    protected router: Router
  ) { }

  ngOnInit() {
    this.loadCustomerPurchase([]);
  }

  public async loadCustomerPurchase(filters) {
    this.typeDataLoaded = false;
    await this.customerPurchaseStore.loadPage(filters);
    this.customerPurchase = this.customerPurchaseStore.getPurchasesList();
    this.typeDataLoaded = true;
  }

  onChangeType(type) {
    this.updateFilter('purchaseType', type);
    this.loadCustomerPurchase(this.filters);
  }

  onFilterApply(filters) {
    const me = this;

    filters.forEach(function(e) {
      me.updateFilter(e.name, e.value);
    });

    this.loadCustomerPurchase(this.filters);
  }

  onFilterReset() {
    this.loadCustomerPurchase([]);
  }

  onTitleClick(item: CustomerPurchase) {
    this.router.navigateByUrl(`/purchases/customer/${item.type.toLowerCase()}/${item.id}/view`);
  }

  /**
   * Обновляет массив c фильтрами в зависимости от полученных новых параметров фильтра
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

  getMainSubtitle(item: CustomerPurchase): string {
    return this.isStepTypeWithExpectedEndDate(item) ?
      item.lots[0].currentStep.label + ' до:' :
      '';
  }

  getStateDate(item: CustomerPurchase): Date|null {
    const currentStep = this.getCustomerPurchaseCurrentStep(item);
    return this.isStepTypeWithExpectedEndDate(item) ?
      currentStep.expectedEndDate :
      null;
  }

  getStartPriceColumnLabel(item: CustomerPurchase): string {
    if (item.type === PurchaseTypes.ORDER) {
      return 'Цена заказа';
    }
    return 'НМЦ';
  }

  protected getCustomerPurchaseCurrentStep(item: CustomerPurchase): CurrentStep|null {
    return (item.lots && item.lots.length > 0) ? item.lots[0].currentStep : null;
  }

  isStepTypeWithExpectedEndDate(item: CustomerPurchase): boolean {
    const currentStep = this.getCustomerPurchaseCurrentStep(item);
    return currentStep
      && (currentStep.type === PurchaseWorkflowStepStatuses.OFFERS_GATHERING
        || currentStep.type === PurchaseWorkflowStepStatuses.ON_SUPPLIER_APPROVAL
        || currentStep.type === PurchaseWorkflowStepStatuses.WINNER_PRICE_REDUCTION);
  }
}
