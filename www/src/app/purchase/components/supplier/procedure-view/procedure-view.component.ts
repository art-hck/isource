import {Component, OnInit, ViewChild} from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { SupplierProcedureStoreService } from 'src/app/purchase/services/supplier-procedure-store.service';
import { SupplierPurchaseLinkedItem } from 'src/app/purchase/models/supplier-purchase-linked-item';
import { PositionsComponent } from '../positions/positions.component';
import {SupplierRequirementDocumentService} from "../../../services/supplier-requirement-document.service";

@Component({
  selector: 'app-procedure-view',
  templateUrl: './procedure-view.component.html',
  styleUrls: ['./procedure-view.component.css']
})
export class ProcedureViewComponent implements OnInit {

  editablePricesMode = false;

  @ViewChild(PositionsComponent, { static: false })
  protected positionsComponent: PositionsComponent;

  constructor(
    private route: ActivatedRoute,
    protected store: SupplierProcedureStoreService,
    protected documentService: SupplierRequirementDocumentService
  ) { }

  ngOnInit() {
    const purchaseId = this.route.snapshot.paramMap.get('id');

    this.store.loadData(purchaseId);
    this.documentService.init(purchaseId);
  }

  protected async onPositionPriceChange(params: {value: number, item: SupplierPurchaseLinkedItem, el: HTMLInputElement}): Promise<void> {
    const price = await this.store.updatePrice(params.item, params.value);
    if (price !== params.value) {
      this.positionsComponent.setMainLinkedItemPrice({value: price, item: params.item, el: params.el});
    }
  }

  onChangeDeliveryPrice(value) {
    this.store.changeDeliveryCost(value).subscribe();
  }
}
