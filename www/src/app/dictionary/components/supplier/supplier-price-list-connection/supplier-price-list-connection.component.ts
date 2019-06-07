import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { Page } from "../../../../order/models/page";
import { SupplierPriceListItem } from "../../../../purchase/models/supplier-price-list-item";
import {ClrDatagridStateInterface} from "@clr/angular";
import { SupplierPriceListStoreService } from "../../../../purchase/services/supplier-price-list-store.service";
import { SupplierPurchaseLinkedItem } from "../../../../purchase/models/supplier-purchase-linked-item";

@Component({
  selector: 'app-supplier-price-list-connection',
  templateUrl: './supplier-price-list-connection.component.html',
  styleUrls: ['./supplier-price-list-connection.component.css']
})
export class SupplierPriceListConnectionComponent implements OnInit {

  @Output() itemSelect = new EventEmitter<SupplierPriceListItem>();
  @Input() linksExist: boolean;

  public searchStr: string;
  public priceListItems: SupplierPriceListItem[];
  public selectedPriceListItem: SupplierPriceListItem;

  public loading = true;
  public total: number;
  public pageSize = 10;

  constructor(
    protected priceListService: SupplierPriceListStoreService,
    protected route: ActivatedRoute
  ) {
  }

  ngOnInit() {
  }

  refresh(state: ClrDatagridStateInterface): void {
    this.loading = true;

    this.priceListService
      .getList(this.searchStr, state)
      .subscribe((data: Page<SupplierPriceListItem>) => {
        this.loading = false;
        this.priceListItems = data.entities;
        this.total = data.totalCount;
      });
  }

  onSearch(): void {
    this.refresh({
      page: {
        from: 0,
        size: this.pageSize
      }
    });
  }

  itemSelected() {
    this.itemSelect.emit(this.selectedPriceListItem);
  }

  refreshPriceList() {
    this.refresh({
      page: {
        from: 0,
        size: this.pageSize
      }
    });
  }
}
