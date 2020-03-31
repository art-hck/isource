import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {RequestPosition} from "../../models/request-position";
import {PaymentTermsLabels} from "../../dictionaries/payment-terms-labels";
import {PositionCancelReasonLabels} from "../../dictionaries/position-cancel-reason-labels";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ToastActions} from "../../../../shared/actions/toast.actions";
import {PositionService} from "../../../back-office/services/position.service";
import {Store} from "@ngxs/store";
import {Uuid} from "../../../../cart/models/uuid";
import {RequestActions} from "../../../back-office/actions/request.actions";
import RefreshPositions = RequestActions.RefreshPositions;

@Component({
  selector: 'app-position-cancel',
  templateUrl: './position-cancel.component.html',
  styleUrls: ['./position-cancel.component.scss']
})
export class PositionCancelComponent implements OnInit {
  @Input() positions: RequestPosition[];
  @Input() requestId: Uuid;
  @Output() close = new EventEmitter();

  form: FormGroup;

  readonly positionCancelReason = Object.entries(PositionCancelReasonLabels);

  constructor(
    private formBuilder: FormBuilder,
    private positionService: PositionService,
    private store: Store
  ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      reason: ['', Validators.required],
      comment: ['']
    });
  }

  submit() {
    const positionIds = this.positions.map(function (position: RequestPosition) {
      return position.id;
    });
    this.positionService.changePositionsStatus(positionIds, 'NOT_RELEVANT', this.form.value).subscribe(() => {
      this.store.dispatch(new RefreshPositions(this.requestId));
      positionIds.length === 1 ? this.store.dispatch(new ToastActions.Success('Позиция отменена')) :
        this.store.dispatch(new ToastActions.Success('Позиции отменены'));
    }, (error) => {
      positionIds.length === 1 ? this.store.dispatch(new ToastActions.Error('Ошибка отмены позиции')) :
        this.store.dispatch(new ToastActions.Error('Ошибка отмены позиций'));
    });
    this.close.emit();
    this.form.reset();
  }
}
