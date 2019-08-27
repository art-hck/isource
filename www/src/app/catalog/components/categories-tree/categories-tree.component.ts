import { Component, OnInit } from '@angular/core';
import { CatalogService } from "../../services/catalog.service";
import { CatalogCategory } from "../../models/catalog-category";
import { CartStoreService } from "../../../cart/services/cart-store.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Uuid } from "../../../cart/models/uuid";

@Component({
  selector: 'app-catalog-categories-tree',
  templateUrl: './categories-tree.component.html',
  styleUrls: ['./categories-tree.component.css']
})
export class CategoriesTreeComponent implements OnInit {
  categoryId: Uuid;
  category: CatalogCategory;
  categories: CatalogCategory[];

  constructor(
    private catalogService: CatalogService,
    private cartStoreService: CartStoreService,
    protected router: Router,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.categoryId = this.route.snapshot.paramMap.get('categoryId');

    this.getCategoryInfo();

    this.getCategoriesTree();
  }

  getCategoryInfo(): void {
    if (!this.categoryId) {
      return;
    }
    this.catalogService.getCategoryInfo(this.categoryId).subscribe(
      (category: CatalogCategory) => {
        this.category = category;
      }
    );
  }

  getCategoriesTree(): void {
    this.catalogService.getCategoriesTree(this.categoryId).subscribe(
      (categories: CatalogCategory[]) => {
        this.categories = categories;
      }
    );
  }

  getTitle(): string {
    if (this.category) {
      return this.category.name;
    }

    return 'Все категории';
  }

  onCategoryClick(category: CatalogCategory): void {
    let url = `catalog/${category.id}`;
    if (category.positionsCount) {
      url = `catalog/${category.id}/positions`;
    }

    this.router.navigateByUrl(url);
  }
}
