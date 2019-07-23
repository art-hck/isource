import { Component, OnInit } from '@angular/core';
import { CatalogService } from "../../services/catalog.service";
import { CatalogPosition } from "../../models/catalog-position";
import { CartStoreService } from "../../../cart/services/cart-store.service";

@Component({
  selector: 'catalog-positions-list',
  templateUrl: './catalog-positions-list.component.html',
  styleUrls: ['./catalog-positions-list.component.css']
})
export class CatalogPositionsListComponent implements OnInit {
  positions: CatalogPosition[];

  constructor(
    private catalogService: CatalogService,
    private cartStoreService: CartStoreService
  ) { }

  ngOnInit() {
    this.catalogService.getPositionsList().subscribe(
      (positions: CatalogPosition[]) => {
        this.positions = positions;
      }
    );
  }

  onAddPositionToCart(position: CatalogPosition): Promise<boolean> {
    return this.cartStoreService.addItem(position);
  }

  isPositionInCart(position: CatalogPosition): boolean {
    return this.cartStoreService.isCatalogPositionInCart(position);
  }
}
