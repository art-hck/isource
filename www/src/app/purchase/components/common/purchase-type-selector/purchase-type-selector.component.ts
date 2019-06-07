import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import { PurchaseTypes } from "../../../enums/purchase-types";

@Component({
  selector: 'app-purchase-type-selector',
  templateUrl: './purchase-type-selector.component.html',
  styleUrls: ['./purchase-type-selector.component.css']
})

export class PurchaseTypeSelectorComponent implements OnInit {

  @Output() changeType = new EventEmitter<any>();

  purchaseTypes = PurchaseTypes;

  constructor() { }

  ngOnInit() {
  }

  onChangeType(type) {
    this.changeType.emit(type);
  }

}
