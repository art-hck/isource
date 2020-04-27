import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { finalize } from "rxjs/operators";
import { FormControl, FormGroup } from "@angular/forms";
import { GroupWithPositions } from "../../../models/groupWithPositions";
import { Request } from "../../../models/request";
import { RequestPosition } from "../../../models/request-position";
import { Subscription } from "rxjs";
import { RequestGroup } from "../../../models/request-group";
import { RequestPositionService } from "../../../services/request-position.service";

@Component({
  selector: 'app-request-move-group-modal',
  templateUrl: 'request-move-group-modal.component.html'
})
export class RequestMoveGroupModalComponent implements OnDestroy {
  @Input() positions: RequestPosition[] = [];
  @Input() groups: RequestGroup[] = [];
  @Input() request: Request;
  @Output() success = new EventEmitter<GroupWithPositions>();
  @Output() close = new EventEmitter();
  subscription = new Subscription();
  isLoading: boolean;

  form = new FormGroup({
    group: new FormControl(false, c => c.value === false ? { "error": true } : null)
  });

  constructor(private positionService: RequestPositionService) {}

  submit() {
    this.isLoading = true;

    this.subscription.add(
      this.positionService.addPositionsInGroup(
        this.request.id,
        this.form.get('group').value.id,
        this.positions.map(position => position.id)
      ).pipe(
        finalize(() => {
          this.isLoading = false;
          this.form.reset();
          this.close.emit();
        })
      ).subscribe(groupWithPositions => this.success.emit(groupWithPositions))
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
