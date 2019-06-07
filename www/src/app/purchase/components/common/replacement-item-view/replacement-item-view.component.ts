import { Component, OnInit, Input } from '@angular/core';
import { RequestPositionOfferChange } from 'src/app/purchase/models/request-position-offer-change';

@Component({
  selector: 'app-purchase-replacement-item-view',
  templateUrl: './replacement-item-view.component.html',
  styleUrls: ['./replacement-item-view.component.css']
})
export class ReplacementItemViewComponent implements OnInit {

  @Input() requestPositionOfferChange: RequestPositionOfferChange;

  constructor() { }

  ngOnInit() {
  }

}
