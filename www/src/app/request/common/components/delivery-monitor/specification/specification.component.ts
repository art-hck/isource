import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-specification',
  templateUrl: './specification.component.html',
  styleUrls: ['./specification.component.scss']
})
export class SpecificationComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }



  getAwaitingProgressWidth() {
    return "0%";
  }

  getProductionProgressWidth() {
    return "20%";
  }

  getShipmentProgressWidth() {
    return "40%";
  }

  getInTransitProgressWidth() {
    return "30%";
  }

  getDeliveredProgressWidth() {
    return "10%";
  }
}
