import {Component, EventEmitter, OnInit, Input, Output} from '@angular/core';
import {SupplierPriceListItem} from "../../../models/supplier-price-list-item";
import {SupplierPriceListStoreService} from "../../../services/supplier-price-list-store.service";
import {PurchasesSupplierStoreService} from "../../../services/purchases-supplier-store.service";
import {Page} from "../../../../order/models/page";
import {ClrDatagridStateInterface} from "@clr/angular";
import { Uuid } from "../../../../cart/models/uuid";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-select-product',
  templateUrl: './select-product.component.html',
  styleUrls: ['./select-product.component.css']
})
export class SelectProductComponent implements OnInit {

  public searchStr: string;
  public priceListItems: SupplierPriceListItem[];
  public selectedPriceListItem: SupplierPriceListItem;

  public analogButtonDisabled: boolean;
  public mainButtonDisabled: boolean;
  public isMainItem: boolean;
  protected purchaseId: Uuid;

  public loading = true;
  public total: number;
  public pageSize = 10;

  @Input() selectedPurchaseItem;
  @Input() isAnalogAllowed: boolean;

  @Output() analogSelect = new EventEmitter<SupplierPriceListItem>();
  @Output() mainSelect = new EventEmitter<SupplierPriceListItem>();
  @Output() itemSelect = new EventEmitter<SupplierPriceListItem>();

  constructor(
    protected priceListService: SupplierPriceListStoreService,
    protected purchasesStoreService: PurchasesSupplierStoreService,
    protected route: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.analogButtonDisabled = false;
    this.mainButtonDisabled = false;
  }

  refresh(state: ClrDatagridStateInterface) {
    this.loading = true;

    this.priceListService
      .getList(this.searchStr, state)
      .subscribe((data: Page<SupplierPriceListItem>) => {
        this.loading = false;
        this.priceListItems = data.entities;
        this.total = data.totalCount;
      });
  }

  onSearch() {
    this.refresh({
      page: {
        from: 0,
        size: this.pageSize
      }
    });
  }

  /**
   * Клик по кнопке "Выбрать как аналог"
   */
  onAnalogSelect() {
    this.analogSelect.emit(this.selectedPriceListItem);
  }

  /**
   * Клик по кнопке "Выбрать"
   */
  onMainSelect() {
    this.mainSelect.emit(this.selectedPriceListItem);
  }

  changeButtonsStatuses(value) {
    this.selectedPriceListItem = value;

    const array = this.selectedPurchaseItem.linkedItems;
    const id = this.selectedPriceListItem.id;

    this.analogButtonDisabled = (this.purchasesStoreService.checkPriceListItemInList(array, id) === true);
    this.mainButtonDisabled = (this.purchasesStoreService.checkSelectedItemHasMainItem(array) === true
      || this.purchasesStoreService.checkPriceListItemInList(array, id) === true);
  }

  /**
   * Функция проверки наличия позиции из прайса в раскрытом списке
   * @param value
   */
  checkItemInList(value) {
    const array = this.selectedPurchaseItem;
    const id = value.id;

    let hasItemFromPrice = false;
    const item = array.linkedItems.find((linkedItem) => linkedItem.priceListId === id);
    if (item) {
      hasItemFromPrice = true;
    }
    return hasItemFromPrice;
  }
}
