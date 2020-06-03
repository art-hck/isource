import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { RequestStatusCount } from "../../models/requests-list/request-status-count";
import { UxgTabTitleComponent } from "uxg";
import { RequestsListFilter } from "../../models/requests-list/requests-list-filter";
import { RequestStatus } from "../../enum/request-status";
import { FeatureService } from "../../../../core/services/feature.service";
import { StateStatus } from "../../models/state-status";
import { RequestsList } from "../../models/requests-list/requests-list";
import { UserInfoService } from "../../../../user/service/user-info.service";
import { AvailableFilters } from "../../../back-office/models/available-filters";
import { map, takeUntil } from "rxjs/operators";
import { ActivatedRoute } from "@angular/router";
import { EventTypes } from "../../../../websocket/event-types";
import { WebsocketService } from "../../../../websocket/websocket.service";
import { Subject } from "rxjs";
import { RequestsListSort } from "../../models/requests-list/requests-list-sort";

@Component({
  selector: 'app-request-list2',
  templateUrl: './request-list2.component.html',
  styleUrls: ['./request-list2.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RequestList2Component implements OnInit, OnDestroy {
  @ViewChild('inProgressTab') inProgressTabElRef: UxgTabTitleComponent;
  @ViewChild('newTab') newTabElRef: UxgTabTitleComponent;
  @ViewChild('draftTab') draftTabElRef: UxgTabTitleComponent;
  @ViewChild('onApprovalTab') onApprovalTabElRef: UxgTabTitleComponent;
  @ViewChild('completedTab') completedTabElRef: UxgTabTitleComponent;

  @Input() statusCounters: RequestStatusCount;
  @Input() status: StateStatus;
  @Input() requests: RequestsList[];
  @Input() total: number;
  @Input() pageSize: number;
  @Input() availableFilters: AvailableFilters;
  @Input() filters: {page?: number, filters?: RequestsListFilter};
  @Input() activeFiltersObj: RequestsListFilter;
  @Output() filter = new EventEmitter<{ page?: number, filters?: RequestsListFilter, sort?: RequestsListSort }>();
  @Output() addRequest = new EventEmitter();
  @Output() refresh = new EventEmitter();

  sortDirection: string = null;
  sortingColumn: string;

  filterOpened = false;
  hideNeedUpdate = true;
  readonly pages$ = this.route.queryParams.pipe(map(params => +params["page"]));
  readonly destroy$ = new Subject();
  readonly RequestStatus = RequestStatus;
  readonly getDeliveryDate = (min, max): string => min === max ? min : min + " – " + max;
  readonly calcPieChart = ({ requestData: d }: RequestsList) => (65 - (65 * d.completedPositionsCount / d.positionsCount * 100) / 100);

  get activeFilters() {
    return this.activeFiltersObj && Object.entries(this.activeFiltersObj)
      .filter(([k, v]: [keyof RequestsListFilter, any]) => {
        return k !== 'requestListStatusesFilter' && v instanceof Array && v.length > 0 || !(v instanceof Array) && v;
      });
  }

  constructor(
    private route: ActivatedRoute,
    private wsService: WebsocketService,
    private cd: ChangeDetectorRef,
    public feature: FeatureService,
    public user: UserInfoService
  ) {}

  ngOnInit() {
    this.wsService.on(EventTypes.REQUEST_LIST_UPDATED).pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.hideNeedUpdate = false;
        this.cd.detectChanges();
      });
  }

  switchTab({ disabled }: UxgTabTitleComponent, status: RequestStatus[]) {
    return !disabled && this.filter.emit({ filters: { requestListStatusesFilter: status } });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }


  sortBy(column) {
    if (this.sortingColumn !== column) {
      this.sortDirection = null;
    }

    const directions = [ "ASC", "DESC", null ];
    let index = directions.indexOf(this.sortDirection) + 1;
    if (index === directions.length) {
      index = 0;
    }
    this.sortDirection = directions[index];
    this.sortingColumn = column;

    if (this.sortDirection === null) {
      this.filter.emit({ sort: { orderBy: null, sortDirection: null } });
      return;
    }

    this.filter.emit({ sort: { orderBy: column, sortDirection: this.sortDirection } });
  }


  switchToPrioritizedTab(requests) {
    // Если заявок не найдено, ничего не делаем, остаёмся в том же табе
    if (requests.entities.length !== 0) {
      return false;
    }

    let firstNotEmptyTab;

    // Находим и сохраняем первый таб, в котором есть результаты по запросу
    for (const [key, value] of Object.entries(requests.statusCounters)) {
      if (value > 0) {
        firstNotEmptyTab = key;
        break;
      }
    }

    // Активируем найденный таб с результатами
    switch (firstNotEmptyTab) {
      case 'inProgressRequestsCount':
        this.clickOnTab(RequestStatus.IN_PROGRESS);
        break;
      case 'newRequestsCount':
        this.clickOnTab(RequestStatus.NEW);
        break;
      case 'onCustomerApprovalRequestsCount':
        this.clickOnTab(RequestStatus.ON_CUSTOMER_APPROVAL);
        break;
      case 'draftRequestsCount':
        this.clickOnTab(RequestStatus.DRAFT);
        break;
      case 'completedRequestsCount':
        this.clickOnTab(RequestStatus.COMPLETED);
        break;
      default:
        return false;
    }
  }

  clickOnTab(tab) {
    switch (tab) {
      // todo Тернарка почему-то не зашла в свитчкейсе, не понял почему
      case RequestStatus.IN_PROGRESS:
        if (this.inProgressTabElRef) {
          this.inProgressTabElRef.onToggle.emit(true);
        } else {
          return false;
        }
        break;
      case RequestStatus.NEW:
        if (this.newTabElRef) {
          this.newTabElRef.onToggle.emit(true);
        } else {
          return false;
        }
        break;
      case RequestStatus.ON_CUSTOMER_APPROVAL:
        if (this.onApprovalTabElRef) {
          this.onApprovalTabElRef.onToggle.emit(true);
        } else {
          return false;
        }
        break;
      case RequestStatus.DRAFT:
        if (this.draftTabElRef) {
          this.draftTabElRef.onToggle.emit(true);
        } else {
          return false;
        }
        break;
      case RequestStatus.COMPLETED:
        if (this.completedTabElRef) {
          this.completedTabElRef.onToggle.emit(true);
        } else {
          return false;
        }
        break;
      default:
        return false;
    }

    this.filter.emit({ filters: { requestListStatusesFilter: [tab] } });
  }
}
