import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { DictionaryStoreService } from "../../../services/dictionary-store.service";
import { SupplierDictionary } from "../../../models/supplier-dictionary";
import {ClrDatagridStateInterface} from "@clr/angular";
import { SupplierPriceListItem } from "../../../../purchase/models/supplier-price-list-item";
import { SupplierPriceListConnectionComponent } from "../supplier-price-list-connection/supplier-price-list-connection.component";


@Component({
  selector: 'app-supplier-dictionary-list',
  templateUrl: './supplier-dictionary-list.component.html',
  styleUrls: ['./supplier-dictionary-list.component.css']
})
export class SupplierDictionaryListComponent implements OnInit {
  @ViewChild(SupplierPriceListConnectionComponent, { static: false })

  private supplierPriceListConnectionComponent: SupplierPriceListConnectionComponent;

  addPositionToPriceListModalOpen = false;

  dictionaryItemSelect: SupplierDictionary;

  public loading = true;
  public dictionaryItems: SupplierDictionary;
  public itemsCount: number;
  public itemSelect: SupplierPriceListItem;
  public catalogCode = 'rosatom';
  public isSoonPurchased = true;
  public currentPage: number;
  public pageSize = 10;
  public item: SupplierDictionary;

  constructor(
    protected dictionaryStoreService: DictionaryStoreService
  ) {
  }

  ngOnInit() {
  }

  refresh(state: ClrDatagridStateInterface): void {
    this.loading = true;
    this.dictionaryStoreService
      .getSupplierDictionaryList(this.catalogCode, this.isSoonPurchased, state)
      .subscribe((dictionaryItems: SupplierDictionary) => {
        this.dictionaryItems = dictionaryItems;
        this.itemsCount = this.dictionaryStoreService.itemsCount;
        this.loading = false;
      });
  }

  itemSelected($event) {
    this.itemSelect = $event;
  }

  onLinkItems() {
    this.dictionaryStoreService.sendLinkItems(this.itemSelect.id, this.dictionaryItemSelect.id)
      .subscribe(() => {
          this.itemSelect.linksExist = true;
        }
      );
  }

  setIsSoonPurchasedFilter(isSoonPurchasedFilterValue): void {
    this.isSoonPurchased = isSoonPurchasedFilterValue;
    this.refresh({
      page: {
        from: 0,
        size: this.pageSize
      }
    });
  }

  onAddPositionToPriceList(params: {item: SupplierDictionary, itemNds: number, itemPrice: number}) {
    this.dictionaryStoreService.addPositionToPriceList(params.item.id, params.item.title, params.itemNds, params.itemPrice)
      .subscribe(() => {
        this.addPositionToPriceListModalOpen = false;
        this.supplierPriceListConnectionComponent.refreshPriceList();
        }
      );
  }

  onAddPositionToPriceListClick() {
    this.addPositionToPriceListModalOpen = true;
  }
}
