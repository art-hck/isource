import { Component, OnInit } from '@angular/core';
import { CatalogService } from "../../services/catalog.service";
import { CatalogPosition } from "../../models/catalog-position";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: 'app-catalog-search-view',
  templateUrl: './search-view.component.html',
  styleUrls: ['./search-view.component.scss']
})
export class SearchViewComponent implements OnInit {
  positions: CatalogPosition[];
  searchStr: string;

  constructor(
    private catalogService: CatalogService,
    protected router: Router,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.searchStr = this.route.snapshot.queryParamMap.get('q');

    this.onSearch(this.searchStr);
  }

  onSearch(searchStr: string): void {
    this.router.navigate(['catalog/search'], {queryParams: {q: searchStr}});
    this.catalogService.searchPositionsByName(searchStr).subscribe(
      (positions: CatalogPosition[]) => {
        this.positions = positions;
      }
    );
  }
}
