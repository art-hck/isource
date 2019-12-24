import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from "@angular/forms";
import { RequestsListFilter } from "../../../models/requests-list/requests-list-filter";
import { debounceTime, filter, switchMap } from "rxjs/operators";
import { Subscription } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { RequestTpFilterCustomerListComponent } from "./request-tp-filter-customer-list/request-tp-filter-customer-list.component";
import { ContragentService } from "../../../../../contragent/services/contragent.service";
import { ContragentList } from "../../../../../contragent/models/contragent-list";

@Component({
  selector: 'app-request-tp-list-filter',
  templateUrl: './request-tp-filter.component.html',
  styleUrls: ['./request-tp-filter.component.scss']
})
export class RequestTpFilterComponent implements OnInit, OnDestroy {

  @ViewChild(RequestTpFilterCustomerListComponent, {static: false})
             requestTpFilterCustomerListComponent: RequestTpFilterCustomerListComponent;

  @Output() filter = new EventEmitter<RequestsListFilter>();
  @Output() showResults = new EventEmitter();

  @Input() backofficeView: boolean;
  @Input() resultsCount: number;

  private subscription: Subscription = new Subscription();

  customersList: ContragentList[];

  public requestTpListFilterForm = new FormGroup({
    'positionName': new FormControl(''),
    'contragents': new FormControl([]),
    'agreementState': new FormControl([])
  });

  filterFormInitialState = {};

  constructor(
    private route: ActivatedRoute,
    private contragentService: ContragentService
  ) { }

  ngOnInit() {
    this.filterFormInitialState = this.requestTpListFilterForm.value;

    this.subscription.add(
      this.route.params.pipe(
        // После того как проинициализировали форму, подписываемся на её изменения
        switchMap(() => this.requestTpListFilterForm.valueChanges),

        // Пропускаем изменения, которые происходят чаще 500ms для разгрузки бэкенда
        debounceTime(500),
        filter(() => this.requestTpListFilterForm.valid)
      ).subscribe(() => this.submit())
    );

    this.getCustomerList();
  }


  submit(): void {
    const filters = <RequestsListFilter>{};

    if (this.requestTpListFilterForm.value) {
      for (const [filterType, filterValue] of Object.entries(this.requestTpListFilterForm.value)) {
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
    this.requestTpListFilterForm.reset({
      positionName: '',
      contragents: [],
      agreementState: [],
      });
    if (this.backofficeView) {
      this.requestTpFilterCustomerListComponent.contragents = [];
      this.requestTpFilterCustomerListComponent.agreementState = [];
      this.requestTpFilterCustomerListComponent.positionName = "";
    }
  }

  /**
   * Сброс значений фильтра без обновления данных
   */
  clearFilter() {
    this.requestTpListFilterForm.reset({
      positionName: '',
      contragents: [],
      agreementState: [],
      }, {
        emitEvent: false
      });

    if (this.backofficeView) {
      this.requestTpFilterCustomerListComponent.contragents = [];
      this.requestTpFilterCustomerListComponent.agreementState = [];
      this.requestTpFilterCustomerListComponent.positionName = "";
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  formIsFilled() {
    return this.requestTpListFilterForm.dirty &&
      JSON.stringify(this.requestTpListFilterForm.value) !== JSON.stringify(this.filterFormInitialState);
  }

  hideFilterModal() {
    this.showResults.emit();
  }

}
