import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
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

@Component({
  selector: 'app-request-list2',
  templateUrl: './request-list2.component.html',
  styleUrls: ['./request-list2.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RequestList2Component implements OnInit, OnDestroy {
  @Input() statusCounts: RequestStatusCount;
  @Input() status: StateStatus;
  @Input() requests: RequestsList[];
  @Input() total: number;
  @Input() pageSize: number;
  @Input() availableFilters: AvailableFilters;
  @Input() filters: {page?: number, filters?: RequestsListFilter};
  @Output() filter = new EventEmitter<{ page?: number, filters?: RequestsListFilter }>();
  @Output() addRequest = new EventEmitter();
  @Output() refresh = new EventEmitter();

  filterOpened = false;
  hideNeedUpdate = true;
  readonly pages$ = this.route.queryParams.pipe(map(params => +params["page"]));
  readonly destroy$ = new Subject();
  readonly RequestStatus = RequestStatus;
  readonly getDeliveryDate = (min, max): string => min === max ? min : min + " - " + max;
  readonly calcPieChart = ({ requestData: d }: RequestsList) => (65 - (65 * d.completedPositionsCount / d.positionsCount * 100) / 100);

  get activeFilters() {
    return this.filters && this.filters.filters && Object.entries(this.filters.filters)
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
        console.log("Refresh motherfucker!");
        this.hideNeedUpdate = false;
        this.cd.detectChanges();
      });
  }

  switchTab({ disabled }: UxgTabTitleComponent, status: RequestStatus) {
    return !disabled && this.filter.emit({ filters: { requestListStatusesFilter: [status] } });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
