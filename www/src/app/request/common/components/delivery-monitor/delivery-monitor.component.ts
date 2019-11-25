import { Component, Input, OnInit } from '@angular/core';
import { RequestPosition } from "../../models/request-position";
import { DeliveryMonitorService } from "../../services/delivery-monitor.service";
import { DeliveryMonitorInfo } from "../../models/delivery-monitor-info";
import * as moment from "moment";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { DeliveryMonitorConsignment } from "../../models/delivery-monitor-consignment";
import { DeliveryMonitorStatus } from "../../enum/delivery-monitor-status";
import { DeliveryMonitorStatusLabels } from "../../dictionaries/delivery-monitor-status-labels";
import { Uuid } from "../../../../cart/models/uuid";
import { DeliveryMonitorCargo } from '../../models/delivery-monitor-cargo';

@Component({
  selector: 'app-delivery-monitor',
  templateUrl: './delivery-monitor.component.html',
  styleUrls: ['./delivery-monitor.component.scss']
})
export class DeliveryMonitorComponent implements OnInit {

  @Input() requestId: Uuid;
  // @Input() requestPosition: RequestPosition; // TODO: 2019-11-20 Раскаментить после демо
  requestPositionValue: RequestPosition; // TODO: 2019-11-20 Убрать после демо

  // TODO: 2019-11-18 Убрать getter и setter requestPosition после демо

  @Input()
  set requestPosition(value: RequestPosition) {
    this.requestPositionValue = value;
    this.goodId = this.getGoodId();
    this.getDeliveryMonitorInfo();
  }

  get requestPosition(): RequestPosition {
    return this.requestPositionValue;
  }

  deliveryMonitorInfo$: Observable<DeliveryMonitorInfo>;
  consignments$: Observable<DeliveryMonitorConsignment[]>;

  goodId: string;
  // demoGoodId = '61'; // TODO: 2019-11-20 Раскаментить после демо

  constructor(
    private deliveryMonitorService: DeliveryMonitorService
  ) { }

  ngOnInit() {
    // используется захардкоженный id, в дальнейшем получать свой id для разных позиций
    // this.goodId = this.demoGoodId; // TODO: 2019-11-20 Раскаментить после демо
    this.goodId = this.getGoodId(); // TODO: 2019-11-20 Убрать после демо
    this.getDeliveryMonitorInfo();
  }

  getDeliveryMonitorInfo(): void {
    this.deliveryMonitorInfo$ = this.deliveryMonitorService.getDeliveryMonitorInfo(this.goodId, this.requestPosition.id);
    this.consignments$ = this.deliveryMonitorInfo$
      .pipe(map(deliveryMonitorInfo => deliveryMonitorInfo.contractAnnex.consignments ));
  }

  getShipmentItemShippingDate(consignment: DeliveryMonitorConsignment): string {
    const shipmentItemCreatedDate = consignment.factualShipmentDate || consignment.planeShipmentDate || null;
    return shipmentItemCreatedDate ? moment(shipmentItemCreatedDate).locale("ru").format('dd, DD.MM') : '—';
  }

  getShipmentItemArrivalDate(consignment: DeliveryMonitorConsignment): string {
    if (this.isEmptyArray(consignment.waybills)) {
      return '—';
    }

    let estimatedDates: Date[] = [];

    for (let i = 0; i < consignment.waybills.length; i++) {
      const waybill = consignment.waybills[i];
      if (waybill.estimatedDateOfArrival) {
        estimatedDates.push(waybill.estimatedDateOfArrival);
      }
    }

    if (this.isEmptyArray(estimatedDates)) {
      return '—';
    }

    if (estimatedDates.length > 1) {
      estimatedDates = estimatedDates.sort(
        (a, b) => a.getTime() - b.getTime()
      );
    }

    return moment(estimatedDates[0]).locale("ru").format('dd, DD.MM');
  }

  consignmentCanBeShown(consignment: DeliveryMonitorConsignment): boolean {
    return (
      !this.isEmptyArray(consignment.cargos) &&
      !this.isEmptyCargo(consignment.cargos[0])
    );
  }

  canGetWaybillInfo(consignment: DeliveryMonitorConsignment): boolean {
    return ((!!consignment.waybills) && (!!consignment.waybills[0]));
  }

  getWeightByTd(consignment: DeliveryMonitorConsignment): number|string {
    if (this.isEmptyArray(consignment.cargos)) {
      return '—';
    }
    return consignment.cargos.reduce(
      (acc, cargo) => acc + (cargo.weightByTd || cargo.amountEi || 0), 0
    );
  }

  getWaybillNumber(consignment: DeliveryMonitorConsignment): string {
    if (this.isEmptyArray(consignment.waybills)) {
      return '—';
    }
    return consignment.waybills.map((waybill) => {
      return waybill.waybillNumber;
    }).join(',');
  }

  getVehicleNumber(consignment: DeliveryMonitorConsignment): string {
    const numbers = new Set<string>();

    if (this.isEmptyArray(consignment.waybills)) {
      return '—';
    }

    for (let i = 0; i < consignment.waybills.length; i++) {
      const waybill = consignment.waybills[i];
      if (this.isEmptyArray(waybill.vehicles)) {
        continue;
      }
      for (let j = 0; j < waybill.vehicles.length; j++) {
        const vehicle = waybill.vehicles[j];
        numbers.add(vehicle.vehicleNumber);
      }
    }

    return [ ...numbers.values() ].join(',');
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case DeliveryMonitorStatus.PENDING:
        return DeliveryMonitorStatusLabels[DeliveryMonitorStatus.PENDING];
      case DeliveryMonitorStatus.LOADED:
        return DeliveryMonitorStatusLabels[DeliveryMonitorStatus.LOADED];
      case DeliveryMonitorStatus.MOVING:
        return DeliveryMonitorStatusLabels[DeliveryMonitorStatus.MOVING];
      case DeliveryMonitorStatus.ARRIVED:
        return DeliveryMonitorStatusLabels[DeliveryMonitorStatus.ARRIVED];
    }
  }

  // TODO: 2019-11-20 Убрать метод getGoodId после демо

  protected getGoodId(): string {
    const positionName = this.requestPositionValue.name;
    const re = /^Установка.*$/i;
    return positionName.match(re) ? '1' : '2';
  }

  protected isEmptyArray(a?: Array<any>|null): boolean {
    return Boolean(!a || a.length === 0);
  }

  protected isEmpty(v: any): boolean {
    return (
      (typeof v === 'string' && v.length === 0) ||
      this.isEmptyArray(v) ||
      (typeof v === 'object' && this.isEmptyArray(Object.keys(v)))
    );
  }

  protected isEmptyCargo(cargo: DeliveryMonitorCargo): boolean {
    return this.isEmpty(cargo.weightByTd) || cargo.weightByTd === 0;
  }
}
