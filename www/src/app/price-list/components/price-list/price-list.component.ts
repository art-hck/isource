import { Component, OnInit } from '@angular/core';
import {SupplierPriceListItem} from "../../../purchase/models/supplier-price-list-item";
import {ClrDatagridStateInterface} from "@clr/angular";
import { Page } from "../../../order/models/page";
import { PriceListService } from "../../services/price-list.service";
import { PriceListItem } from "../../models/price-list-item";

@Component({
  selector: 'app-price-list',
  templateUrl: './price-list.component.html',
  styleUrls: ['./price-list.component.css']
})
export class PriceListComponent implements OnInit {
  addItemToPriceListModalOpen = false;

  public loading = true;
  public searchStr: string;
  public priceListItems: SupplierPriceListItem[];
  public total: number;
  public pageSize = 10;
  public selected = [];

  constructor(
    private priceListService: PriceListService
  ) {
  }

  ngOnInit() {
  }

  refresh(state: ClrDatagridStateInterface) {
    this.loading = true;

    this.priceListService
      .getList(this.searchStr, state)
      .subscribe((data: Page<SupplierPriceListItem>) => {
        this.loading = false;
        this.priceListItems = data.entities;
        this.total = data.totalCount;
      });
  }

  onSearch() {
    this.selected = [];
    this.refresh({
      page: {
        from: 0,
        size: this.pageSize
      }
    });
  }

  onAddItemToPriceListClick() {
    this.addItemToPriceListModalOpen = true;
  }

  onAddItemToPriceList(priceListItem: PriceListItem) {
    this.priceListService.addPriceListItem(priceListItem)
      .subscribe(() => {
        this.addItemToPriceListModalOpen = false;
        this.refresh({
          page: {
            from: 0,
            size: this.pageSize
          }
        });
      }
    );
  }
}
