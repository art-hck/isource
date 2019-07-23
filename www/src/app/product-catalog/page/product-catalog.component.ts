import { Component, OnInit } from '@angular/core';
import { CatalogProductsStoreService } from '../services/catalog-products-store.service';
import { CatalogProduct } from '../models/catalog-product';
import {ActivatedRoute} from "@angular/router";
import {AggregatedResult} from "../../core/models/aggregated-result";


@Component({
  selector: 'app-product-catalog',
  templateUrl: './product-catalog.component.html',
  styleUrls: ['./product-catalog.component.css']
})
export class ProductCatalogComponent implements OnInit {
  items: CatalogProduct[];
  private catalogCode: string;
  currPage: number;
  pageSize: number;
  totalCount = 0;
  isLoading = false;

  constructor (
    protected store: CatalogProductsStoreService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.items = [];
    this.currPage = 0;
    this.pageSize = 25;

    this.catalogCode = this.route.snapshot.data.catalogCode;

    this.loadProductsPage();
  }

  loadProductsPage() {
    this.currPage++;
    this.isLoading = true;
    this.store.loadPage(this.catalogCode, this.currPage, this.pageSize).subscribe(
      this.addProducts.bind(this)
    );
  }

  protected addProducts(data: AggregatedResult<CatalogProduct>) {
    this.isLoading = false;
    this.totalCount = data.totalCount;
    this.items.push(...data.entries);
  }

  onSearch(searchStr: string) {
    this.loadProductsPage();
  }

  onCategoriesClick() {
  }
}
