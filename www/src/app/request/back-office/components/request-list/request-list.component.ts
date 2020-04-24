import { Component, OnInit, Output, ViewChild } from '@angular/core';
import { RequestsList } from "../../../common/models/requests-list/requests-list";
import { RequestService } from "../../services/request.service";
import { Page } from "../../../../core/models/page";
import { RequestStatus } from "../../../common/enum/request-status";
import { RequestsListFilter } from "../../../common/models/requests-list/requests-list-filter";
import { RequestStatusCount } from "../../../common/models/requests-list/request-status-count";
import { RequestListFilterComponent } from "../../../common/components/request-list/request-list-filter/request-list-filter.component";
import { AvailableFilters } from "../../models/available-filters";
import { Observable } from "rxjs";

@Component({
  templateUrl: './request-list.component.html',
  styleUrls: ['./request-list.component.scss']
})
export class RequestListComponent implements OnInit {

  @ViewChild(RequestListFilterComponent) requestListFilterComponent: RequestListFilterComponent;

  currentDatagridState;
  currentStatus: string;
  currentFilters: RequestsListFilter;

  filterModalOpened = false;

  public requests: RequestsList[];
  @Output() totalItems: number;
  @Output() datagridLoader: boolean;

  filters: any;
  requestWorkflowSteps = RequestStatus;
  requestStatusCount: RequestStatusCount;
  availableFilters$: Observable<AvailableFilters>;

  constructor(private requestService: RequestService) {}

  ngOnInit() {
    this.currentStatus = RequestStatus.IN_PROGRESS;
    this.getRequestStatusCount('backoffice');
    this.availableFilters$ = this.requestService.availableFilters();
  }

  /**
   * Здесь происходит объединение фильтров из правой панели и фильтров по статусам
   */
  composeFilters(): void {
    const statusTab = { 'requestListStatusesFilter': [this.currentStatus] };
    this.filters = {...this.currentFilters, ...statusTab};
  }

  /**
   * Переключалка табов со статусами — записывает в переменную выбранный статус и сбрасывает фильтры справа
   *
   * @param requestStatus
   */
  switchTab(requestStatus: RequestStatus): void {
    this.requests = null;
    this.currentStatus = requestStatus;
    this.composeFilters();

    if (this.requestListFilterComponent) {
      this.requestListFilterComponent.resetFilter(false);
      this.currentFilters = <RequestsListFilter>{};
    }
  }

  /**
   * Функция вызывается при обновлении значении фильтров в дочернем компоненте с фильтрами справа
   *
   * @param filter
   */
  onFilterUpdate(filter: RequestsListFilter): void {
    this.currentFilters = filter;
    this.composeFilters();

    let pageSize = null;
    if (this.currentDatagridState) {
      pageSize = this.currentDatagridState.pageSize;
    }

    this.getRequestListForBackoffice(0, pageSize, this.filters);
  }

  /**
   * Функция вызывается при изменеии состояния датагрида — например, при пагинации
   *
   * @param state
   */
  onDatagridStateChange(state): void {
    this.currentDatagridState = state;
    this.composeFilters();
    this.getRequestStatusCount('backoffice');

    this.getRequestListForBackoffice(state.startFrom, state.pageSize, this.filters);
  }

  getRequestListForBackoffice(startFrom, pageSize, filters): void {
    this.requestService.getRequests(startFrom, pageSize, filters).subscribe(
      (data: Page<RequestsList>) => {
        this.requests = data.entities;
        this.totalItems = data.totalCount;
      });
  }

  /**
   * Функция получает кол-во заявок по статусу («В обработке (23)»)
   *
   * @param role
   */
  getRequestStatusCount(role: string) {
    this.requestService.requestStatusCount().subscribe(
      (requestStatusCount: RequestStatusCount) => {
        this.requestStatusCount = requestStatusCount;
      }
    );
  }

  /**
   * Функция получает кол-во активных фильтров («Фильтр [2]»)
   */
  getFilterCounter() {
    if (this.currentFilters) {
      const activeFilters = Object.keys(this.currentFilters).filter(
        filterItem => filterItem !== 'requestListStatusesFilter'
      );
      return activeFilters.length;
    }
    return 0;
  }

  onShowResults() {
    this.filterModalOpened = false;
  }
}
