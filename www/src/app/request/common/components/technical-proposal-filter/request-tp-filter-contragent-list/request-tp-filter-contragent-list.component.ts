import { Component, ElementRef, forwardRef, Input, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { Uuid } from "../../../../../cart/models/uuid";
import { ContragentList } from "../../../../../contragent/models/contragent-list";

@Component({
  selector: 'app-request-tp-filter-contragent-list',
  templateUrl: './request-tp-filter-contragent-list.component.html',
  styleUrls: ['./request-tp-filter-contragent-list.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => RequestTpFilterContragentListComponent),
    multi: true
  }]
})
export class RequestTpFilterContragentListComponent implements ControlValueAccessor {

  @Input() contragents;
  @Input() limit: number;

  @ViewChild('contragentSearchInput', { static: false }) contragentSearchInput: ElementRef;

  contragentSearchValue = "";
  selectedContragents = [];

  value: Uuid[];
  onTouched: (value: Uuid[]) => void;
  onChange: (value: Uuid[]) => void;

  showAll = false;

  constructor() { }

  getContragents(): ContragentList[] {
    // Если showAll = true или не указан limit — возвращаем всё
    if (this.contragents) {
      return this.contragents.slice(0, this.showAll ? this.contragents.length : (this.limit || this.contragents.length));
    }
  }

  onContragentSearchInputChange(value: string): void {
    this.contragentSearchValue = value;
  }

  getContragentSearchInputValue(): string {
    if (this.contragentSearchValue && this.contragentSearchInput) {
      return this.contragentSearchInput.nativeElement.value;
    }
    return this.contragentSearchValue;
  }

  onContragentSelected(selectedContragent) {
    this.updateArray(this.selectedContragents, selectedContragent);
    this.onChange(this.selectedContragents);
  }

  checkIfContragentIsChecked(contragentId) {
    return this.selectedContragents && this.selectedContragents.indexOf(contragentId) > -1;
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

  protected updateArray(array: Array<Object>, item: Object): void {
    const index = array.indexOf(item);

    if (index === -1) {
      array.push(item);
    } else {
      array.splice(index, 1);
    }
  }
}
