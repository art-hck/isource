import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { finalize, flatMap } from "rxjs/operators";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { RequestPositionService } from "../../../services/request-position.service";
import { GroupWithPositions } from "../../../models/groupWithPositions";
import { Request } from "../../../models/request";
import { RequestPosition } from "../../../models/request-position";
import { Subscription } from "rxjs";

@Component({
  selector: 'app-request-group-form',
  templateUrl: 'request-group-form.component.html'
})
export class RequestGroupFormComponent implements OnDestroy {
  @Input() positions: RequestPosition[] = [];
  @Input() request: Request;
  @Output() success = new EventEmitter<GroupWithPositions>();
  @Output() close = new EventEmitter();
  subscription = new Subscription();
  isLoading: boolean;

  form = new FormGroup({
    name: new FormControl("", Validators.required)
  });

  constructor(private positionService: RequestPositionService) {}

  submit() {
    if (this.form.valid) {
      this.isLoading = true;
      this.subscription.add(
        this.positionService.saveGroup(this.request.id, this.form.get('name').value).pipe(
          flatMap(requestGroup => this.positionService.addPositionsInGroup(
            this.request.id,
            requestGroup.id,
            this.positions.map(position => position.id)
          )),
          finalize(() => {
            this.isLoading = false;
            this.form.reset();
            this.close.emit();
          })
        ).subscribe(groupWithPositions => this.success.emit(groupWithPositions))
      );
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
