import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
    private store: Store,
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
      this.store.dispatch(new ToastActions.Error('Ошибка смены статуса позиций'));
      this.loading = false;
    });
  }

  valid() {
    return this.status !== this.newStatus;
  }
}
