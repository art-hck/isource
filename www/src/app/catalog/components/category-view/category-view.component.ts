import { Component, OnInit } from '@angular/core';
import { CatalogService } from "../../services/catalog.service";
import { CatalogPosition } from "../../models/catalog-position";
import { CartStoreService } from "../../../cart/services/cart-store.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Uuid } from "../../../cart/models/uuid";
import { CatalogCategory } from "../../models/catalog-category";

@Component({
  selector: 'app-category-view',
  templateUrl: './category-view.component.html',
  styleUrls: ['./category-view.component.scss']
})
export class CategoryViewComponent implements OnInit {
  categoryId: Uuid;
  category: CatalogCategory;
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
    this.categoryId = this.route.snapshot.paramMap.get('categoryId');

    this.route.params.subscribe(routeParams => {
      this.categoryId = routeParams.categoryId;
      this.getCategoryInfo();
      this.getPositionList();
    });
  }

  getCategoryInfo(): void {
    this.catalogService.getCategoryInfo(this.categoryId).subscribe(
      (category: CatalogCategory) => {
        this.category = category;
      }
    );
  }

  getPositionList(): void {
    this.catalogService.getPositionsList(this.categoryId).subscribe(
      (positions: CatalogPosition[]) => {
        this.positions = positions;
      }
    );
  }

  onSearch(searchStr: string): void {
    // если пользуемся общим поиском, то ищем по всем позициям
    this.router.navigate(['catalog/search'], {queryParams: {q: searchStr}});
  }
}
