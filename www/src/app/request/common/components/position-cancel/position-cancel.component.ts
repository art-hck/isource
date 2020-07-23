import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RequestPosition } from "../../models/request-position";
import { PositionCancelReasonLabels } from "../../dictionaries/position-cancel-reason-labels";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ToastActions } from "../../../../shared/actions/toast.actions";
import { PositionService } from "../../../back-office/services/position.service";
import { Store } from "@ngxs/store";
import { Uuid } from "../../../../cart/models/uuid";
import { RequestActions as BackofficeRequestActions } from "../../../back-office/actions/request.actions";
import BackofficeRefreshPositions = BackofficeRequestActions.RefreshPositions;
import { RequestActions as CustomerRequestActions } from "../../../customer/actions/request.actions";
import CustomerRefreshPositions = CustomerRequestActions.RefreshPositions;
import { UserInfoService } from "../../../../user/service/user-info.service";

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
    private store: Store,
    public user: UserInfoService
  ) {
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      reason: ['', Validators.required],
      comment: ['']
    });
    if (this.user.isCustomer()) {
      this.form.disable();
    }
  }

  submit() {
    if (this.form.valid) {
      const positionIds = this.positions.map(({ id }: RequestPosition) => id);
      const [newStatus, role] = this.user.isCustomer() ? ['CANCELED', 'customer'] : ['NOT_RELEVANT', 'backoffice'];
      this.positionService.changePositionsStatus(positionIds, newStatus, role, this.form.value).subscribe(() => {
        this.user.isCustomer() ? this.store.dispatch(new CustomerRefreshPositions(this.requestId)) :
          this.store.dispatch(new BackofficeRefreshPositions(this.requestId));
        this.store.dispatch(new ToastActions.Success(positionIds.length === 1 ? 'Позиция отменена' : 'Позиции отменены'));
      }, () => {
        this.store.dispatch(new ToastActions.Error(positionIds.length === 1 ? 'Ошибка отмены позиции' : 'Ошибка отмены позиций'));
      });
      this.close.emit();
      this.form.reset();
    }
  }
}
