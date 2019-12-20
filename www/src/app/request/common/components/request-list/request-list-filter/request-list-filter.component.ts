import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from "@angular/forms";
import { RequestsListFilter } from "../../../models/requests-list/requests-list-filter";
import { debounceTime, filter, switchMap } from "rxjs/operators";
import { Subscription } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { RequestFilterCustomerListComponent } from "./request-filter-customer-list/request-filter-customer-list.component";
import { ContragentService } from "../../../../../contragent/services/contragent.service";
import { ContragentList } from "../../../../../contragent/models/contragent-list";

@Component({
  selector: 'app-request-list-filter',
  templateUrl: './request-list-filter.component.html',
  styleUrls: ['./request-list-filter.component.scss']
})
export class RequestListFilterComponent implements OnInit, OnDestroy {

  @ViewChild(RequestFilterCustomerListComponent, {static: false})
             requestFilterCustomerListComponent: RequestFilterCustomerListComponent;

  @Output() filter = new EventEmitter<RequestsListFilter>();
  @Output() showResults = new EventEmitter();

  @Input() backofficeView: boolean;
  @Input() resultsCount: number;

  private subscription: Subscription = new Subscription();

  customersList: ContragentList[];

  public requestListFilterForm = new FormGroup({
    'requestNameOrNumber': new FormControl(''),
    'onlyOpenTasks': new FormControl(false),
    'customers': new FormControl([]),
    'shipmentDateFrom': new FormControl(''),
    'shipmentDateTo': new FormControl(''),
    'shipmentDateAsap': new FormControl(false),
  });

  filterFormInitialState = {};

  constructor(
    private route: ActivatedRoute,
    private contragentService: ContragentService
  ) { }

  ngOnInit() {
    this.filterFormInitialState = this.requestListFilterForm.value;

    this.subscription.add(
      this.route.params.pipe(
        // После того как проинициализировали форму, подписываемся на её изменения
        switchMap(() => this.requestListFilterForm.valueChanges),

        // Пропускаем изменения, которые происходят чаще 500ms для разгрузки бэкенда
        debounceTime(500),
        filter(() => this.requestListFilterForm.valid)
      ).subscribe(() => this.submit())
    );

    this.getCustomerList();
  }


  submit(): void {
    const filters = <RequestsListFilter>{};

    if (this.requestListFilterForm.value) {
      for (const [filterType, filterValue] of Object.entries(this.requestListFilterForm.value)) {
        if ((filterValue instanceof Array) && filterValue.length === 0) {
          continue;
        }
        if (filterValue) {
          filters[filterType] = filterValue;
        }
      }
    }

    this.filter.emit(filters);
  }

  getCustomerList() {
    this.contragentService.getCustomersList().subscribe(customers => {
      this.customersList = customers;
    });
  }

  /**
   * Сброс значений фильтра и подтягивание новых данных
   */
  resetFilter() {
    this.requestListFilterForm.reset({
        requestNameOrNumber: '',
        onlyOpenTasks: false,
        customers: [],
        shipmentDateFrom: '',
        shipmentDateTo: '',
        shipmentDateAsap: false
      });
    if (this.backofficeView) {
      this.requestFilterCustomerListComponent.selectedCustomers = [];
      this.requestFilterCustomerListComponent.customerSearchValue = "";
    }
  }

  /**
   * Сброс значений фильтра без обновления данных
   */
  clearFilter() {
    this.requestListFilterForm.reset({
        requestNameOrNumber: '',
        onlyOpenTasks: false,
        customers: [],
        shipmentDateFrom: '',
        shipmentDateTo: '',
        shipmentDateAsap: false
      }, {
        emitEvent: false
      });

    if (this.backofficeView) {
      this.requestFilterCustomerListComponent.selectedCustomers = [];
      this.requestFilterCustomerListComponent.customerSearchValue = "";
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  formIsFilled() {
    return this.requestListFilterForm.dirty &&
      JSON.stringify(this.requestListFilterForm.value) !== JSON.stringify(this.filterFormInitialState);
  }

  hideFilterModal() {
    this.showResults.emit();
  }

}
