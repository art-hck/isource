import { Component, OnInit } from '@angular/core';
import { CatalogService } from "../../services/catalog.service";
import { CatalogPosition } from "../../models/catalog-position";
import { CartStoreService } from "../../../cart/services/cart-store.service";
import { Router } from "@angular/router";

@Component({
  selector: 'catalog-positions-list',
  templateUrl: './catalog-positions-list.component.html',
  styleUrls: ['./catalog-positions-list.component.css']
})
export class CatalogPositionsListComponent implements OnInit {
  positions: CatalogPosition[];
  searchName: string;

  constructor(
    private catalogService: CatalogService,
    private cartStoreService: CartStoreService,
    protected router: Router
  ) {
  }

  ngOnInit() {
    this.getPositionList();
  }

  getPositionList() {
    this.catalogService.getPositionsList().subscribe(
      (positions: CatalogPosition[]) => {
        this.positions = positions;
      }
    );
  }

  onSearch(searchName: string) {
    this.catalogService.searchPositionsByName(searchName).subscribe(
      (positions: CatalogPosition[]) => {
        this.positions = positions;
      }
    );
  }

  createRequest() {
    this.router.navigateByUrl(`requests/create`);
  }

  onAddPositionToCart(position: CatalogPosition): Promise<boolean> {
    return this.cartStoreService.addItem(position);
  }

  isPositionInCart(position: CatalogPosition): boolean {
    return this.cartStoreService.isCatalogPositionInCart(position);
  }
}
