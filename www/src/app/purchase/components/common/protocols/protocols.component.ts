import { Component, Input, OnInit } from '@angular/core';
import { PurchaseProtocol } from "../../../models/purchase-protocol";

@Component({
  selector: 'app-purchase-protocols',
  templateUrl: './protocols.component.html',
  styleUrls: ['./protocols.component.css']
})
export class ProtocolsComponent implements OnInit {

  @Input() protocols?: PurchaseProtocol[];

  constructor() { }

  ngOnInit() {
  }

}
