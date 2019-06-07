import { Component, Input, OnInit } from '@angular/core';
import { Purchase } from "../../../models/purchase";
import { PurchaseWorkflowStepStatuses } from "../../../enums/purchase-workflow-step-statuses";
import { formatDate } from "@angular/common";
import { CurrentStep } from "../../../models/current-step";

@Component({
  selector: 'app-purchase-view-header',
  templateUrl: './purchase-view-header.component.html',
  styleUrls: ['./purchase-view-header.component.css']
})
export class PurchaseViewHeaderComponent implements OnInit {

  @Input() purchase: Purchase;

  constructor() { }

  ngOnInit() {
  }

  getStatus(purchase: Purchase): string {
    const currentStep = this.getPurchaseCurrentStep(purchase);
    if (!currentStep) {
      return '';
    } else {
      return purchase.lots[0].currentStep.label;
    }
  }

  getStatusEndDate(purchase: Purchase): string|null {
    const currentStep = this.getPurchaseCurrentStep(purchase);
    if (!currentStep
      || currentStep.type === PurchaseWorkflowStepStatuses.ARCHIVE
      || currentStep.type === PurchaseWorkflowStepStatuses.PUBLISHED) {
      return null;
    }
    return ' до: ' + formatDate(currentStep.expectedEndDate, 'dd.MM.yyyy, hh:mm', 'ru');
  }

  protected getPurchaseCurrentStep(purchase: Purchase): CurrentStep|null {
    return purchase.lots ? purchase.lots[0].currentStep : null;
  }

}
