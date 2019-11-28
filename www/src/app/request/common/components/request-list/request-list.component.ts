import { Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import {RequestsList} from "../../models/requests-list/requests-list";
import {Router} from "@angular/router";
import {RequestTypes} from "../../enum/request-types";
import { ClrDatagridStateInterface } from "@clr/angular";
import { GpnmarketConfigInterface } from "../../../../core/config/gpnmarket-config.interface";
import { APP_CONFIG } from '@stdlib-ng/core';
import { DatagridStateAndFilter } from "../../models/datagrid-state-and-filter";
import { RequestWorkflowSteps } from "../../enum/request-workflow-steps";

@Component({
  selector: 'app-request-list',
  templateUrl: './request-list.component.html',
  styleUrls: ['./request-list.component.css']
})

export class RequestListComponent implements OnInit {

  appConfig: GpnmarketConfigInterface;

  @ViewChild('datagridElement', { static: false }) datagridElement: ElementRef;
  currentDatagridState: ClrDatagridStateInterface;
  datagridFilter: {};

  @Input() customerNameColumnShow = false;
  @Input() requests: RequestsList[];
  @Input() totalItems: number;
  @Input() requestStatus: RequestWorkflowSteps;

  @Output() datagridState = new EventEmitter<DatagridStateAndFilter>();

  datagridLoader = false;
  pageSize = 10;

  requestWorkflowSteps = RequestWorkflowSteps;

  constructor(
    protected router: Router,
    @Inject(APP_CONFIG) appConfig: GpnmarketConfigInterface
  ) {
    this.appConfig = appConfig;
    this.pageSize = this.appConfig.paginator.pageSize;
  }

  ngOnInit() {
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
}
