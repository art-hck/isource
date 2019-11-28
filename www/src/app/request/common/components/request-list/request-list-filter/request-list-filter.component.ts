import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from "@angular/forms";
import { RequestsListFilter } from "../../../models/requests-list/requests-list-filter";
import { debounceTime, filter, flatMap, switchMap } from "rxjs/operators";
import { of, Subscription } from "rxjs";
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

  constructor(
    private route: ActivatedRoute,
    private contragentService: ContragentService
  ) { }

  ngOnInit() {
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

  clearFilter() {
    this.requestListFilterForm.reset();
    this.requestFilterCustomerListComponent.selectedCustomers = [];
    this.requestFilterCustomerListComponent.customerSearchValue = "";
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  formIsFilled() {
    if (this.requestListFilterForm.value) {
      // Простите за этот код
      return (
        (this.requestListFilterForm.get('requestNameOrNumber').value !== "") ||
        (this.requestListFilterForm.get('onlyOpenTasks').value !== false) ||
        (this.requestListFilterForm.get('customers').value.length !== 0) ||
        (this.requestListFilterForm.get('shipmentDateFrom').value !== "") ||
        (this.requestListFilterForm.get('shipmentDateTo').value !== "") ||
        (this.requestListFilterForm.get('shipmentDateAsap').value !== false)
      );
    }
    return false;
  }

  hideFilterModal() {
    this.showResults.emit();
  }

}
