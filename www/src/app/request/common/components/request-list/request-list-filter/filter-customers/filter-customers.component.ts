import { Component, ElementRef, forwardRef, Input, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { Uuid } from "../../../../../../cart/models/uuid";
import { ContragentList } from "../../../../../../contragent/models/contragent-list";

@Component({
  selector: 'app-request-filter-customer-list',
  templateUrl: './filter-customers.component.html',
  styleUrls: ['./filter-customers.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => FilterCustomersComponent),
    multi: true
  }]
})
export class FilterCustomersComponent implements ControlValueAccessor {

  @Input() customers;
  @Input() limit: number;

  @ViewChild('customerSearchInput', { static: false }) customerSearchInput: ElementRef;

  customerSearchValue = "";

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

  check(selectedCustomer) {
    if (this.value.indexOf(selectedCustomer) === -1) {
      this.writeValue([...this.value, selectedCustomer]);
    } else {
      this.writeValue(this.value.filter(customer => customer !== selectedCustomer));
    }
    this.onChange(this.value);
  }

  checked(customerId): boolean {
    return (this.value || []).indexOf(customerId) > -1;
  }

  registerOnChange = fn => this.onChange = fn;
  registerOnTouched = fn => this.onTouched = fn;
  writeValue = value => this.value = value;
}
