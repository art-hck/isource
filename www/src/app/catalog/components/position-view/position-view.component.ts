import { Component, OnInit } from '@angular/core';
import { Observable } from "rxjs";
import { CatalogPosition } from "../../models/catalog-position";
import { CatalogService } from "../../services/catalog.service";
import { ActivatedRoute } from "@angular/router";
import { CartStoreService } from "../../../cart/services/cart-store.service";

@Component({
  selector: 'app-position-view',
  templateUrl: './position-view.component.html',
  styleUrls: ['./position-view.component.scss']
})
export class PositionViewComponent implements OnInit {
  position$: Observable<CatalogPosition>;

  constructor(
              private catalogService: CatalogService,
              private route: ActivatedRoute,
              private cartStoreService: CartStoreService
  ) {
  }

  ngOnInit() {
    this.route.params.subscribe(routeParams => {
      const positionId = routeParams.positionId;
      this.position$ = this.catalogService.getPositionInfo(positionId);
    });
  }

  onAddPositionToCart(position: CatalogPosition): Promise<boolean> {
    return this.cartStoreService.addItem(position);
  }
}
