import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";
import { RequestsListFilter } from "../../models/requests-list/requests-list-filter";
import { debounceTime, filter, switchMap } from "rxjs/operators";
import { Subscription } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { RequestTpFilterContragentListComponent } from "./request-tp-filter-contragent-list/request-tp-filter-contragent-list.component";
import { ContragentService } from "../../../../contragent/services/contragent.service";
import { ContragentList } from "../../../../contragent/models/contragent-list";
import { TechnicalProposalsService } from "../../../back-office/services/technical-proposals.service";
import { Uuid } from "../../../../cart/models/uuid";
import { TechnicalProposal } from "../../models/technical-proposal";
import { RequestTpFilterStatusesListComponent } from "./request-tp-filter-statuses-list/request-tp-filter-statuses-list.component";

@Component({
  selector: 'app-request-tp-list-filter',
  templateUrl: './request-tp-filter.component.html',
  styleUrls: ['./request-tp-filter.component.scss']
})
export class RequestTpFilterComponent implements OnInit, OnDestroy {

  @ViewChild(RequestTpFilterContragentListComponent, {static: false})
             requestTpFilterContragentListComponent: RequestTpFilterContragentListComponent;
  @ViewChild(RequestTpFilterStatusesListComponent, {static: false})
             requestTpFilterStatusesListComponent: RequestTpFilterStatusesListComponent;

  @Output() filters = new EventEmitter<RequestsListFilter>();
  @Output() showResults = new EventEmitter();

  @Input() backofficeView: boolean;
  @Input() resultsCount: number;
  @Input() technicalProposals: TechnicalProposal[] = [];

  private subscription: Subscription = new Subscription();

  requestId: Uuid;
  contragents: ContragentList[] = [];
  tpStatuses = [];

  requestTpListFilterForm: FormGroup;

  filterFormInitialState = {};

  constructor(
    private route: ActivatedRoute,
    private contragentService: ContragentService,
    private formBuilder: FormBuilder,
    private technicalProposalsService: TechnicalProposalsService
  ) { }

  ngOnInit() {
    this.requestTpListFilterForm = this.formBuilder.group({
      positionName: [''],
      contragents: [[]],
      tpStatus: [[]],
    });

    this.requestId = this.route.snapshot.paramMap.get('id');

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

    this.getTechnicalProposals();
    this.getContragentList();
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

    this.filters.emit(filters);
  }

  getTechnicalProposals(): void {
    this.getContragentList();
    this.getAgreementStateList();
  }


  getContragentList(): void {
    this.technicalProposals.forEach(tp => {
      this.contragents.push(tp.supplierContragent);
    });

    // Убираем из массива дублирующихся контрагентов
    this.contragents = this.contragents.filter((value, index, array) =>
      !array.filter((v, i) => JSON.stringify(value) === JSON.stringify(v) && i < index).length);
  }

  getAgreementStateList(): void {
    this.technicalProposals.forEach(tp => {
      this.tpStatuses.push(tp.status);
    });

    // Убираем из массива дублирующиеся статусы
    this.tpStatuses = this.tpStatuses.filter((value, index, array) =>
      !array.filter((v, i) => JSON.stringify(value) === JSON.stringify(v) && i < index).length);
  }

  /**
   * Сброс значений фильтра и подтягивание новых данных
   */
  resetFilter() {
    this.requestTpListFilterForm.reset({
      positionName: '',
      contragents: [],
      tpStatus: [],
      });

    this.requestTpFilterContragentListComponent.selectedContragents = [];
    this.requestTpFilterContragentListComponent.contragentSearchValue = "";

    this.requestTpFilterStatusesListComponent.selectedStatuses = [];
  }


  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  formIsFilled(): boolean {
    return this.requestTpListFilterForm.dirty &&
      JSON.stringify(this.requestTpListFilterForm.value) !== JSON.stringify(this.filterFormInitialState);
  }

}
