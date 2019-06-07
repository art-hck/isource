import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { PurchaseWorkflowStepLabelsForFilter } from '../../../dictionaries/purchase-workflow-step-labels-for-filter';
import { NgForm } from '@angular/forms';
import createAutoCorrectedDatePipe from 'text-mask-addons/dist/createAutoCorrectedDatePipe';
import * as moment from 'moment';

@Component({
  selector: 'app-purchase-filter',
  templateUrl: './purchase-filter.component.html',
  styleUrls: ['./purchase-filter.component.css']
})
export class PurchaseFilterComponent implements OnInit {

  @Output() filterReset = new EventEmitter<any>();
  @Output() filterApply = new EventEmitter<any>();

  autoCorrectedDatePipe: any = createAutoCorrectedDatePipe('dd.mm.yyyy');

  public dateMask = [/\d/, /\d/, '.', /\d/, /\d/, '.', /[1-3]/, /\d/, /\d/, /\d/];

  purchaseWorkflowStepLabels = Object.entries(PurchaseWorkflowStepLabelsForFilter);

  validPurchaseCreationStartDate = true;
  validPurchaseCreationEndDate = true;
  validPurchaseStartDate = true;
  validPurchaseEndDate = true;

  purchaseNumber = '';
  purchaseStatus = '';
  purchaseCreationStartDate = '';
  purchaseCreationEndDate = '';
  purchaseStartDate = '';
  purchaseEndDate = '';

  constructor() { }

  ngOnInit() {
  }

  applyFilter() {
    this.filterApply.emit(this.getFilters());
  }

  resetFilter(form: NgForm) {
    form.reset();

    this.validPurchaseCreationStartDate = true;
    this.validPurchaseCreationEndDate = true;
    this.validPurchaseStartDate = true;
    this.validPurchaseEndDate = true;

    this.filterApply.emit(this.getFilters());
  }

  getFilters() {
    return [
      { name: 'purchaseNumber', value: this.purchaseNumber ? this.purchaseNumber : '' },
      { name: 'purchaseStatus', value: this.purchaseStatus ? this.purchaseStatus : '' },
      { name: 'purchaseCreationStartDate', value: this.purchaseCreationStartDate ? this.purchaseCreationStartDate : '' },
      { name: 'purchaseCreationEndDate', value: this.purchaseCreationEndDate ? this.purchaseCreationEndDate : '' },
      { name: 'purchaseStartDate', value: this.purchaseStartDate ? this.purchaseStartDate : '' },
      { name: 'purchaseEndDate', value: this.purchaseEndDate ? this.purchaseEndDate : '' },
    ];
  }


  checkDateInputValidity(date, input) {
    switch (input) {
      case 'validPurchaseCreationStartDate': {
        this.validPurchaseCreationStartDate = this.validDate(this.purchaseCreationStartDate);
        break;
      }
      case 'validPurchaseCreationEndDate': {
        this.validPurchaseCreationEndDate = this.validDate(this.purchaseCreationEndDate);
        break;
      }
      case 'validPurchaseStartDate': {
        this.validPurchaseStartDate = this.validDate(this.purchaseStartDate);
        break;
      }
      case 'validPurchaseEndDate': {
        this.validPurchaseEndDate = this.validDate(this.purchaseEndDate);
        break;
      }
    }
  }


  validDate(date) {
    return date === '' ? true : moment(date, "DD.MM.YYYY", true).isValid();
  }
}
