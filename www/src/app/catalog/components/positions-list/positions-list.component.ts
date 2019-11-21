import { Component, Input, OnInit } from '@angular/core';
import { CatalogService } from "../../services/catalog.service";
import { CatalogPosition } from "../../models/catalog-position";
import { CartStoreService } from "../../../cart/services/cart-store.service";
import { Router } from "@angular/router";
import { Uuid } from "../../../cart/models/uuid";
import { ContragentInfo } from "../../../contragent/models/contragent-info";
import { ContragentService } from "../../../contragent/services/contragent.service";

@Component({
  selector: 'app-catalog-positions-list',
  templateUrl: './positions-list.component.html',
  styleUrls: ['./positions-list.component.scss']
})
export class PositionsListComponent implements OnInit {
  @Input() positions: CatalogPosition[];

  contragent: ContragentInfo;

  constructor(
    protected getContragentService: ContragentService,
    private catalogService: CatalogService,
    private cartStoreService: CartStoreService,
    protected router: Router
  ) {
  }

  ngOnInit() {
  }

  onAddPositionToCart(position: CatalogPosition, quantity: number) {
    return this.cartStoreService.addItem(position, quantity);
  }

  isPositionInCart(position: CatalogPosition): boolean {
    return this.cartStoreService.isCatalogPositionInCart(position);
  }

}
