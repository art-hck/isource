import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PurchasesSupplierReplacementsStoreService } from 'src/app/purchase/services/purchases-supplier-replacements-store.service';

@Component({
  selector: 'app-purchase-supplier-replacement-items-view',
  templateUrl: './replacement-items-view.component.html',
  styleUrls: ['./replacement-items-view.component.css']
})
export class ReplacementItemsViewComponent implements OnInit {

  constructor(
    protected route: ActivatedRoute,
    protected store: PurchasesSupplierReplacementsStoreService
  ) { }

  ngOnInit() {
    this.store.purchaseId = this.route.snapshot.paramMap.get('id');
    this.store.loadPurchaseInfo();
    this.store.loadRequestPositionOfferChanges();
  }

}
