import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { PositionStatusesLabels } from "../../../common/dictionaries/position-statuses-labels";
import { PositionService } from "../../services/position.service";
import { RequestPosition } from "../../../common/models/request-position";
import { ToastActions } from "../../../../shared/actions/toast.actions";
import { Store } from "@ngxs/store";

@Component({
  selector: 'app-positions-status-change',
  templateUrl: './positions-status-change.component.html',
  styleUrls: ['./positions-status-change.component.scss']
})
export class PositionsStatusChangeComponent implements OnInit, OnChanges {

  protected _status: string;

  @Input() positions: RequestPosition[];
  @Output() changeStatus = new EventEmitter<string>();
  @Input()
  set status(value: string) {
    this._status = value;
    this.newStatus = value;
  }
  get status() {
    return this._status;
  }

  newStatus: string;
  statuses = [];
  loading = false;

  constructor(
    private positionService: PositionService,
    private store: Store,
  ) {
  }

  ngOnInit(): void {
    this.newStatus = this.status;

    this.updateAvailableStatuses();
  }

  ngOnChanges(): void {
    this.updateAvailableStatuses();
  }

  updateAvailableStatuses(): void {
    const intersection = this.getIntersectionOfAvailableStatuses();

    this.statuses = Object.entries(PositionStatusesLabels)
      .filter(item => intersection.includes(item[0]));
  }

  getIntersectionOfAvailableStatuses(): string[] {
    if (!this.positions.length) {
      return [];
    }

    let intersection = this.positions[0].availableStatuses;
    for (let i = 1; i < this.positions.length; i++) {
      intersection = this.positions[i].availableStatuses.filter(value => intersection.includes(value));
    }

    return intersection;
  }

  getStatusLabel(status: string): string {
    return PositionStatusesLabels[status];
  }

  onChangeBtn() {
    const positionIds = this.positions.map(function (position: RequestPosition) {
      return position.id;
    });
    this.loading = true;
    this.positionService.changePositionsStatus(positionIds, this.newStatus, 'backoffice').subscribe(() => {
      this.loading = false;
      this.changeStatus.emit(this.status);
    }, (error) => {
      this.store.dispatch(new ToastActions.Error('Ошибка смены статуса позиций'));
      this.loading = false;
    });
  }

  valid() {
    return this.status !== this.newStatus;
  }
}
