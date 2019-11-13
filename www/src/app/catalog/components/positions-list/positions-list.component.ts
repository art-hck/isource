import { Component, Input, OnInit } from '@angular/core';
import { CatalogService } from "../../services/catalog.service";
import { CatalogPosition } from "../../models/catalog-position";
import { CartStoreService } from "../../../cart/services/cart-store.service";
import { Router } from "@angular/router";
import { Uuid } from "../../../cart/models/uuid";
import { ContragentInfo } from "../../../contragent/models/contragent-info";
import { ContragentService } from "../../../contragent/services/contragent.service";
import { Observable } from "rxjs";
import { publishReplay, refCount } from "rxjs/operators";
import { RequestsList } from "../../../request/common/models/requests-list/requests-list";
import { RequestPosition } from "../../../request/common/models/request-position";

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

  onAddPositionToCart(position: CatalogPosition, quantity: number) {
    return this.cartStoreService.addItem(position, quantity);
  }

  isPositionInCart(position: CatalogPosition): boolean {
    return this.cartStoreService.isCatalogPositionInCart(position);
  }

  showContragentInfo(event: MouseEvent, contragentId: Uuid): void {
    // При клике не даём открыться ссылке из href, вместо этого показываем модальное окно
    event.preventDefault();

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

  onPositionClick(position: CatalogPosition): void {
    this.router.navigateByUrl(`/catalog/position/${position.id}`);
  }
}
