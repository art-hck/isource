import { Component, OnInit } from '@angular/core';
import { CatalogService } from "../../services/catalog.service";
import { CatalogPosition } from "../../models/catalog-position";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable } from "rxjs";
import { CatalogCategoryFilter } from "../../models/catalog-category-filter";

@Component({
  selector: 'app-catalog-search-view',
  templateUrl: './search-view.component.html',
  styleUrls: ['./search-view.component.scss']
})
export class SearchViewComponent implements OnInit {
  positions$: Observable<CatalogPosition[]>;
  query: string;

  constructor(private catalogService: CatalogService, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe(routeParams => {
        this.query = routeParams.q;
        this.positions$ = this.catalogService.searchPositionsByName(this.query);
      });
  }

  filter(filter: CatalogCategoryFilter) {
    this.positions$ = this.catalogService.searchPositionsByName(this.query, filter);
  }
}
