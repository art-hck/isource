import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { PriceListItem } from "../../models/price-list-item";
import { MeasureUnitItem } from "../../../core/models/measure-unit-item";
import { NsiService } from "../../../core/services/nsi.service";
import { CurrencyItem } from "../../../core/models/currency-item";

@Component({
  selector: 'app-add-item-modal',
  templateUrl: './add-item-modal.component.html',
  styleUrls: ['./add-item-modal.component.css']
})
export class AddItemModalComponent implements OnInit {
  protected _opened = false;

  @Input()
  set opened(val) {
    this._opened = val;
    this.openedChange.emit(val);
  }
  get opened() {
    return this._opened;
  }

  @Output() openedChange = new EventEmitter<boolean>();
  @Output() submitAction = new EventEmitter<PriceListItem>();

  itemDataForm: FormGroup;
  priceListItem: PriceListItem;
  measureUnits: MeasureUnitItem[];
  currencies: CurrencyItem[];

  constructor(private formBuilder: FormBuilder, private nsiService: NsiService) { }

  ngOnInit() {
    this.itemDataForm = this.formBuilder.group({
      itemName: ['', [Validators.required]],
      units: ['', [Validators.required]],
      ndsPercent: ['20'],
      priceWithNds: [null, [Validators.required]],
      currency: ['RUB', [Validators.required]],
      tth: [''],
      supplierRegion: ['']
    });

    this.nsiService.getMeasureUnitList().subscribe((data: MeasureUnitItem[]) => {
        this.measureUnits = data;
      }
    );
    this.nsiService.getCurrencyList().subscribe((data: CurrencyItem[]) => {
        this.currencies = data;
      }
    );
  }

  onAddPriceListItem(): void {
    this.priceListItem = this.itemDataForm.value;
    this.submitAction.emit(this.priceListItem);
  }

  onCloseClick(): void {
    this.opened = false;
  }

  isFieldValid(field: string) {
    return this.itemDataForm.get(field).errors
      && (this.itemDataForm.get(field).touched || this.itemDataForm.get(field).dirty);
  }
}
