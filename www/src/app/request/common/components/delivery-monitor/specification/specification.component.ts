import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-specification',
  templateUrl: './specification.component.html',
  styleUrls: ['./specification.component.scss']
})
export class SpecificationComponent implements OnInit {

  totalCount: number;

  awaitingCount: number;
  productionCount: number;
  shipmentCount: number;
  inTransitCount: number;
  deliveredCount: number;

  constructor() { }

  ngOnInit() {
    this.awaitingCount = 8.00;
    this.productionCount = 16.17;
    this.shipmentCount = 25;
    this.inTransitCount = 10.5;
    this.deliveredCount = 27.65;

    this.totalCount =
      this.awaitingCount +
      this.productionCount +
      this.shipmentCount +
      this.inTransitCount +
      this.deliveredCount;
  }



  getProgressWidth(countParam) {
    const percent = (countParam / this.totalCount) * 100 ;
    return percent + "%";
  }
}
