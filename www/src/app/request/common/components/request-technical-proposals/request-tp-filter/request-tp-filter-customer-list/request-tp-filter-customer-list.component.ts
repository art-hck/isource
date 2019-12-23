import { Component, ElementRef, forwardRef, Input, OnInit, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { Uuid } from "../../../../../../cart/models/uuid";
import { ContragentList } from "../../../../../../contragent/models/contragent-list";

@Component({
  selector: 'app-request-filter-customer-list',
  templateUrl: './request-filter-customer-list.component.html',
  styleUrls: ['./request-filter-customer-list.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => RequestTpFilterCustomerListComponent),
    multi: true
  }]
})
export class RequestTpFilterCustomerListComponent implements ControlValueAccessor {

  @Input() customers;
  @Input() limit: number;

  @ViewChild('customerSearchInput', { static: false }) customerSearchInput: ElementRef;

  customerSearchValue = "";
  selectedCustomers = [];

  value: Uuid[];
  onTouched: (value: Uuid[]) => void;
  onChange: (value: Uuid[]) => void;

  showAll = false;

  constructor() { }

  getCustomers(): ContragentList[] {
    // Если showAll = true или не указан limit — возвращаем всё
    if (this.customers) {
      return this.customers.slice(0, this.showAll ? this.customers.length : (this.limit || this.customers.length));
    }
  }

  onCustomerSearchInputChange(value: string): void {
    this.customerSearchValue = value;
  }

  getCustomerSearchInputValue(): string {
    if (this.customerSearchValue && this.customerSearchInput) {
      return this.customerSearchInput.nativeElement.value;
    }
    return this.customerSearchValue;
  }

  onCustomerSelected(selectedCustomer) {
    this.updateArray(this.selectedCustomers, selectedCustomer);
    this.onChange(this.selectedCustomers);
  }

  checkIfCustomerIsChecked(customerId) {
    return this.selectedCustomers && this.selectedCustomers.indexOf(customerId) > -1;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  writeValue(value: Uuid[] | null): void {
    this.value = value;
  }

  // canSeeToggleLink(customers, limit) {
  //   return customers && limit > 0 &&
  //   (
  //     limit > customers.length ||
  //     limit >= filteredCustomers.length
  //   );
  // }


  protected updateArray(array: Array<Object>, item: Object): void {
    const index = array.indexOf(item);

    if (index === -1) {
      array.push(item);
    } else {
      array.splice(index, 1);
    }
  }
}
