import {
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {RequestsList} from "../../models/requests-list/requests-list";
import {Router} from "@angular/router";
import {RequestTypes} from "../../enum/request-types";
import { ClrDatagridStateInterface } from "@clr/angular";
import { GpnmarketConfigInterface } from "../../../../core/config/gpnmarket-config.interface";
import { APP_CONFIG } from '@stdlib-ng/core';
import { DatagridStateAndFilter } from "../../models/datagrid-state-and-filter";
import { RequestWorkflowSteps } from "../../enum/request-workflow-steps";
import { WebsocketService } from "../../../../websocket/websocket.service";
import { EventTypes } from "../../../../websocket/event-types";
import { Message } from "../../models/message";
import { SubscriptionLike } from "rxjs";

@Component({
  selector: 'app-request-list',
  templateUrl: './request-list.component.html',
  styleUrls: ['./request-list.component.css']
})

export class RequestListComponent implements OnInit, OnDestroy {

  appConfig: GpnmarketConfigInterface;

  @ViewChild('datagridElement', { static: false }) datagridElement: ElementRef;
  datagridFilter: {};

  @Input() customerNameColumnShow = false;
  @Input() requests: RequestsList[];
  @Input() totalItems: number;
  @Input() requestStatus: RequestWorkflowSteps;

  @Output() datagridState = new EventEmitter<DatagridStateAndFilter>();
  currentDatagridState: ClrDatagridStateInterface;

  datagridLoader = false;
  pageSize = 10;
  hideNeedUpdate = true;
  wsSubscription: SubscriptionLike;

  requestWorkflowSteps = RequestWorkflowSteps;

  constructor(
    protected router: Router,
    private wsService: WebsocketService,
    @Inject(APP_CONFIG) appConfig: GpnmarketConfigInterface
  ) {
    this.appConfig = appConfig;
    this.pageSize = this.appConfig.paginator.pageSize;
  }

  ngOnInit() {
    this.wsSubscription = this.wsService.on<any>(EventTypes.REQUEST_LIST_UPDATED.valueOf())
      .subscribe(() => {
        this.hideNeedUpdate = false;
      });
  }

  ngOnDestroy(): void {
    if (this.wsSubscription) {
      this.wsSubscription.unsubscribe();
      this.wsSubscription = null;
    }
  }

  /**
   * Функция возвращает строку с датой поставки позиций — либо дата, либо диапазон дат
   *
   * @param request
   */
  getDeliveryDate(minDate: string, maxDate: String): string {
    const dates = [minDate, maxDate];
    return dates.filter((date, index) => dates.indexOf(date) === index).join(' – ');
  }

  calcPieChart(request: RequestsList) {
    const completedItems =  request.requestData.completedPositionsCount / request.requestData.positionsCount * 100;
    return (65 - (65 * completedItems) / 100);
  }

  onRowClick(request: RequestsList): void {
    const role = this.customerNameColumnShow ? 'backoffice' : 'customer';
    this.router.navigateByUrl(`/requests/${role}/${request.request.id}`);
  }

  checkIfFreeFormRequest(type: string) {
    return type === RequestTypes.FREE_FORM;
  }

  refresh(state: ClrDatagridStateInterface): void {
    this.currentDatagridState = state;
    const datagridState: DatagridStateAndFilter = {
      startFrom: state.page && state.page.from >= 0 ? state.page.from : 0,
      pageSize: state.page && state.page.size >= 0 ? state.page.size : this.pageSize,
      filters: this.datagridFilter ? this.datagridFilter : {},
    };

    this.datagridState.emit(datagridState);
  }

  onUpdateList() {
    this.hideNeedUpdate = true;
    this.refresh(this.currentDatagridState);
  }

}
