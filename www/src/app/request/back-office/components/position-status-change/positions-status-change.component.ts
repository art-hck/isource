import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PositionStatusesLabels } from "../../../common/dictionaries/position-statuses-labels";
import { PositionService } from "../../services/position.service";
import { RequestPosition } from "../../../common/models/request-position";
import { NotificationService } from "../../../../shared/services/notification.service";

@Component({
  selector: 'app-positions-status-change',
  templateUrl: './positions-status-change.component.html',
  styleUrls: ['./positions-status-change.component.scss']
})
export class PositionsStatusChangeComponent implements OnInit {

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
  statuses = Object.entries(PositionStatusesLabels);
  loading = false;

  constructor(
    private positionService: PositionService,
    private notificationService: NotificationService,
  ) {
  }

  ngOnInit(): void {
    this.newStatus = this.status;
  }

  onChangeBtn() {
    const positionIds = this.positions.map(function (position: RequestPosition) {
      return position.id;
    });
    this.loading = true;
    this.positionService.changePositionsStatus(positionIds, this.newStatus).subscribe(() => {
      this.loading = false;
      this.changeStatus.emit(this.status);
    }, (error) => {
      this.notificationService.toast('Ошибка смены статуса позиций', 'error');
      this.loading = false;
    });
  }

  valid() {
    return this.status !== this.newStatus;
  }
}
