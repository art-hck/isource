import { Component, OnInit, Input } from '@angular/core';
import {CatalogProduct} from "../../models/catalog-product";
import {PricelistStoreService} from "../../services/pricelist-store.service";
import {ProductAttribute} from "../../models/product-attribute";

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent implements OnInit {
  readonly MAX_ATTRIBUTES = 4;

  @Input() item: CatalogProduct;

  constructor(
    protected store: PricelistStoreService
  ) {
  }

  ngOnInit() {
  }

  async loadTopPrices() {
    if (this.item.topPrices) {
      return;
    }
    this.item.topPrices = await this.store.loadTopPrices(this.item.id);
  }

  getAttributesWithValues(item: CatalogProduct): ProductAttribute[] {
    const attributesWithValues = item.attributes.filter((attribute) => !!attribute.value);
    return attributesWithValues.slice(0, this.MAX_ATTRIBUTES);
  }
}
