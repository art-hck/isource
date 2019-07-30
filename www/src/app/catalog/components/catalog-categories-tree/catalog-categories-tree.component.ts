import { Component, OnInit } from '@angular/core';
import { CatalogService } from "../../services/catalog.service";
import { CatalogCategory } from "../../models/catalog-category";
import { CartStoreService } from "../../../cart/services/cart-store.service";
import { Router, ActivatedRoute } from "@angular/router";
import { Uuid } from "../../../cart/models/uuid";

@Component({
  selector: 'catalog-categories-tree',
  templateUrl: './catalog-categories-tree.component.html',
  styleUrls: ['./catalog-categories-tree.component.css']
})
export class CatalogCategoriesTreeComponent implements OnInit {
  categoryId: Uuid;
  category: CatalogCategory;
  categories: CatalogCategory[];
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

    this.getCategoryInfo();

    this.getCategoriesTree();
  }

  getCategoryInfo() {
    if (!this.categoryId) {
      return;
    }
    this.catalogService.getCategoryInfo(this.categoryId).subscribe(
      (category: CatalogCategory) => {
        this.category = category;
      }
    );
  }

  getCategoriesTree() {
    this.catalogService.getCategoriesTree(this.categoryId).subscribe(
      (categories: CatalogCategory[]) => {
        this.categories = categories;
      }
    );
  }

  getTitle() {
    if (this.category) {
      return this.category.name
    }

    return 'Все категории';
  }

  onCategoryClick(category: CatalogCategory) {
    let url = `catalog/${category.id}`;
    if (category.positionsCount) {
      url = `catalog/${category.id}/positions`;
    }

    document.location.href = url;
    //this.router.navigateByUrl(url);
  }
}
