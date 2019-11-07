import { Component, OnInit } from '@angular/core';
import { CatalogService } from "../../services/catalog.service";
import { CatalogPosition } from "../../models/catalog-position";
import { ActivatedRoute } from "@angular/router";
import { CatalogCategory } from "../../models/catalog-category";
import { Observable } from "rxjs";
import { CatalogCategoryFilter } from "../../models/catalog-category-filter";
import { Uuid } from "../../../cart/models/uuid";

@Component({
  selector: 'app-category-view',
  templateUrl: './category-view.component.html',
  styleUrls: ['./category-view.component.scss']
})
export class CategoryViewComponent implements OnInit {

  categoryId: Uuid;
  category$: Observable<CatalogCategory>;
  positions$: Observable<CatalogPosition[]>;

  constructor(private catalogService: CatalogService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe(routeParams => {
      this.categoryId = routeParams.categoryId;
      this.category$ = this.catalogService.getCategoryInfo(this.categoryId);
      this.positions$ = this.catalogService.getPositionsList(this.categoryId);
    });
  }

  filter(filter: CatalogCategoryFilter) {
    this.positions$ = this.catalogService.getPositionsList(this.categoryId, filter);
  }
}
