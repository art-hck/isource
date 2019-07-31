import { Component, OnInit } from '@angular/core';
import { CatalogService } from "../../services/catalog.service";
import { CatalogPosition } from "../../models/catalog-position";
import { CartStoreService } from "../../../cart/services/cart-store.service";
import { Router, ActivatedRoute } from "@angular/router";
import { Uuid } from "../../../cart/models/uuid";
import { CatalogCategory } from "../../models/catalog-category";

@Component({
  selector: 'catalog-positions-list',
  templateUrl: './catalog-positions-list.component.html',
  styleUrls: ['./catalog-positions-list.component.css']
})
export class CatalogPositionsListComponent implements OnInit {
  categoryId: Uuid;
  // category: CatalogCategory;
  positions: CatalogPosition[];
  searchName: string;

  constructor(
    private catalogService: CatalogService,
    private cartStoreService: CartStoreService,
    protected router: Router,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit() {
    // this.categoryId = this.route.snapshot.paramMap.get('categoryId');

    // this.getCategoryInfo();

    this.getPositionList();
  }

  /*getCategoryInfo(): void {
    this.catalogService.getCategoryInfo(this.categoryId).subscribe(
      (category: CatalogCategory) => {
        this.category = category;
      }
    );
  }*/

  getPositionList(): void {
    this.catalogService.getPositionsList(this.categoryId).subscribe(
      (positions: CatalogPosition[]) => {
        this.positions = positions;
      }
    );
  }

  onSearch(searchName: string): void {
    this.catalogService.searchPositionsByName(searchName).subscribe(
      (positions: CatalogPosition[]) => {
        this.positions = positions;
      }
    );
  }

  createRequest(): void {
    this.router.navigateByUrl(`requests/create`);
  }

  onAddPositionToCart(position: CatalogPosition): Promise<boolean> {
    return this.cartStoreService.addItem(position);
  }

  isPositionInCart(position: CatalogPosition): boolean {
    return this.cartStoreService.isCatalogPositionInCart(position);
  }
}
