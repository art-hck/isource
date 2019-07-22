import { Component, OnInit } from '@angular/core';
import { CatalogService } from "../../services/catalog.service";
import { CatalogPosition } from "../../models/catalog-position";

@Component({
  selector: 'catalog-positions-list',
  templateUrl: './catalog-positions-list.component.html',
  styleUrls: ['./catalog-positions-list.component.css']
})
export class CatalogPositionsListComponent implements OnInit {
  positions: CatalogPosition[];

  constructor(
    private catalogService: CatalogService
  ) { }

  ngOnInit() {
    this.catalogService.getPositionsList().subscribe(
      (positions: CatalogPosition[]) => {
        this.positions = positions;
      }
    );
  }
}
