import { Component, OnInit } from '@angular/core';
import { Observable } from "rxjs";
import { CatalogPosition } from "../../models/catalog-position";
import { CatalogService } from "../../services/catalog.service";
import { ActivatedRoute } from "@angular/router";
import { CartStoreService } from "../../../cart/services/cart-store.service";
import { Uuid } from "../../../cart/models/uuid";
import { ContragentInfo } from "../../../contragent/models/contragent-info";
import { ContragentService } from "../../../contragent/services/contragent.service";
import { CatalogCategoryAttribute } from "../../models/catalog-category-attribute";

@Component({
  selector: 'app-position-view',
  templateUrl: './position-view.component.html',
  styleUrls: ['./position-view.component.scss']
})
export class PositionViewComponent implements OnInit {
  position$: Observable<CatalogPosition>;
  attributes$: Observable<CatalogCategoryAttribute[]>;

  contragent: ContragentInfo;
  contragentInfoModalOpened = false;

  constructor(
    protected getContragentService: ContragentService,
    private catalogService: CatalogService,
    private route: ActivatedRoute,
    private cartStoreService: CartStoreService
  ) {
  }

  ngOnInit() {
    this.route.params.subscribe(routeParams => {
      const positionId = routeParams.positionId;
      this.position$ = this.catalogService.getPositionInfo(positionId);
      this.attributes$ = this.catalogService.getPositionAttributes(positionId);
    });
  }

  onAddPositionToCart(position: CatalogPosition): Promise<boolean> {
    return this.cartStoreService.addItem(position);
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

}
