import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { SupplierDictionary } from "../../../models/supplier-dictionary";

@Component({
  selector: 'app-add-position-to-price-list-modal',
  templateUrl: './add-position-to-price-list-modal.component.html',
  styleUrls: ['./add-position-to-price-list-modal.component.css']
})
export class AddPositionToPriceListModalComponent implements OnChanges {
  protected _opened = false;

  @Input()
  set opened(val) {
    this._opened = val;
    this.openedChange.emit(val);
  }
  get opened() {
    return this._opened;
  }

  @Input() dictionaryItem: SupplierDictionary;
  @Output() openedChange = new EventEmitter<boolean>();
  @Output() submitAction = new EventEmitter<{item: SupplierDictionary, itemNds: number, itemPrice: number}>();

  pricePosition: number;
  nds = '20';

  constructor() { }

  ngOnChanges() {
    this.clearInput();
  }

  onActionClick(): void {
    this.submitAction.emit(
      {
        item: this.dictionaryItem,
        itemNds: +this.nds,
        itemPrice: this.pricePosition
      }
    );
  }

  onCloseClick(): void {
    this.opened = false;
  }

  clearInput() {
    this.pricePosition = null;
  }
}
