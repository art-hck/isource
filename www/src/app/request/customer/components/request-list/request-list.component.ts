import { Component, OnInit, Output, ViewChild } from '@angular/core';
import { GetRequestsService } from "../../../common/services/get-requests.service";
import { RequestsList } from "../../../common/models/requests-list/requests-list";
import { Page } from "../../../../core/models/page";
import { DatagridStateAndFilter } from "../../../common/models/datagrid-state-and-filter";
import { RequestsListFilter } from "../../../common/models/requests-list/requests-list-filter";
import { RequestStatus } from "../../../common/enum/request-status";
import { RequestListFilterComponent } from "../../../common/components/request-list/request-list-filter/request-list-filter.component";
import { RequestStatusCount } from "../../../common/models/requests-list/request-status-count";
import { Router } from "@angular/router";
import { CreateRequestService } from "../../../common/services/create-request.service";
import { RequestService } from "../../services/request.service";
import { ToastActions } from "../../../../shared/actions/toast.actions";
import { Store } from "@ngxs/store";
import { catchError, flatMap, mapTo, tap } from "rxjs/operators";

@Component({
  templateUrl: './request-list.component.html',
  styleUrls: ['./request-list.component.scss']
})
export class RequestListComponent implements OnInit {

  @ViewChild(RequestListFilterComponent, {static: false})
  requestListFilterComponent: RequestListFilterComponent;

  currentDatagridState: DatagridStateAndFilter;
  currentStatus: string;
  currentFilters: RequestsListFilter;

  filterModalOpened = false;

  public requests: RequestsList[];
  @Output() totalItems: number;
  @Output() datagridLoader: boolean;

  filters: any;
  requestWorkflowSteps = RequestStatus;
  requestStatusCount: RequestStatusCount;

  constructor(
    protected router: Router,
    protected getRequestService: GetRequestsService,
    protected createRequestService: CreateRequestService,
    protected requestService: RequestService,
    protected store: Store
  ) {
  }

  ngOnInit() {
    this.currentStatus = RequestStatus.IN_PROGRESS;
    this.getRequestStatusCount('customer');
  }

  /**
   * Здесь происходит объединение фильтров из правой панели и фильтров по статусам
   */
  composeFilters(): void {
    const statusTab = {'requestListStatusesFilter': [this.currentStatus]};
    this.filters = {...this.currentFilters, ...statusTab};
  }

  /**
   * Переключалка табов со статусами — записывает в переменную выбранный статус и сбрасывает фильтры справа
   *
   * @param requestStatus
   */
  switchTab(requestStatus: RequestStatus): void {
    this.currentStatus = requestStatus;
    this.composeFilters();

    if (this.requestListFilterComponent) {
      this.requestListFilterComponent.clearFilter();
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

    this.getRequestListForCustomer(0, pageSize, this.filters);
  }

  /**
   * Функция вызывается при изменеии состояния датагрида — например, при пагинации
   *
   * @param state
   */
  onDatagridStateChange(state: DatagridStateAndFilter): void {
    this.currentDatagridState = state;
    this.composeFilters();
    this.getRequestStatusCount('customer');

    this.getRequestListForCustomer(state.startFrom, state.pageSize, this.filters);
  }

  getRequestListForCustomer(startFrom, pageSize, filters): void {
    this.getRequestService.getRequests('customer', startFrom, pageSize, filters).subscribe(
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
    this.getRequestService.requestStatusCount(role).subscribe(
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

  onSendExcelFile(requestData: { files: File[], requestName: string }): void {
    this.createRequestService.addRequestFromExcel(requestData.files, requestData.requestName).pipe(
      tap(() => this.store.dispatch(new ToastActions.Success("Черновик заявки создан"))),
      tap(({id}) => this.router.navigateByUrl(`requests/customer/${id}`)),
      catchError(({error}) => this.store.dispatch(
        new ToastActions.Error(`Ошибка в шаблоне${error && error.detail && ': ' + error.detail || ''}`)
      ))
    ).subscribe();
  }

  onPublishExcelFile(requestData: { files: File[], requestName: string }): void {
    this.createRequestService.addRequestFromExcel(requestData.files, requestData.requestName).pipe(
      flatMap(data => this.requestService.publishRequest(data.id).pipe(mapTo(data))),
      tap(() => this.store.dispatch(new ToastActions.Success("Заявка опубликована"))),
      tap(({id}) => this.router.navigateByUrl(`requests/customer/${id}`)),
      catchError(({error}) => this.store.dispatch(
        new ToastActions.Error(`Ошибка в шаблоне${error && error.detail && ': ' + error.detail || ''}`)
      ))
    ).subscribe();
  }
}
