import { Component, OnInit } from '@angular/core';
import {PositionsList} from "../../models/positions-list";
import {CatalogService} from "../../services/catalog.service";

@Component({
  selector: 'catalog-positions-list',
  templateUrl: './catalog-positions-list.component.html',
  styleUrls: ['./catalog-positions-list.component.css']
})
export class CatalogPositionsListComponent implements OnInit {
  positions: PositionsList[];

  constructor(
    private catalogService: CatalogService
  ) { }

  ngOnInit() {
    this.catalogService.getPositionsList().subscribe(
      (positions: PositionsList[]) => {
        this.positions = positions;
      }
    );
  }
}
