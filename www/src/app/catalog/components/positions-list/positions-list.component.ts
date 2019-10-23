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
  contragentInfoModalOpened = false;

  constructor(
    protected getContragentService: ContragentService,
    private catalogService: CatalogService,
    private cartStoreService: CartStoreService,
    protected router: Router
  ) {
  }

  ngOnInit() {
  }

  onAddPositionToCart(position: CatalogPosition): Promise<boolean> {
    return this.cartStoreService.addItem(position);
  }

  isPositionInCart(position: CatalogPosition): boolean {
    return this.cartStoreService.isCatalogPositionInCart(position);
  }

  showContragentInfo(contragentId: Uuid): void {
    this.contragentInfoModalOpened = true;

    if (!this.contragent || this.contragent.id !== contragentId) {
      this.contragent = null;

      const subscription = this.getContragentService
        .getContragentInfo(contragentId)
        .subscribe(contragentInfo => {
          this.contragent = contragentInfo;
          subscription.unsubscribe();
        });
    }
  }

}
