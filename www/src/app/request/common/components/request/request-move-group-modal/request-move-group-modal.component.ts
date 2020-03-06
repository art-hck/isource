import { ClrModal } from "@clr/angular";
import { Component, EventEmitter, Input, OnDestroy, Output, ViewChild } from '@angular/core';
import { finalize, flatMap } from "rxjs/operators";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { GroupService } from "../../../services/group.service";
import { GroupWithPositions } from "../../../models/groupWithPositions";
import { Request } from "../../../models/request";
import { RequestPosition } from "../../../models/request-position";
import { Subscription } from "rxjs";
import { RequestGroup } from "../../../models/request-group";

@Component({
  selector: 'app-request-move-group-modal',
  templateUrl: 'request-move-group-modal.component.html'
})
export class RequestMoveGroupModalComponent implements OnDestroy {
  @ViewChild(ClrModal, { static: false }) modal: ClrModal;
  @Input() positions: RequestPosition[] = [];
  @Input() groups: RequestGroup[] = [];
  @Input() request: Request;
  @Output() success = new EventEmitter<GroupWithPositions>();
  subscription = new Subscription();
  isLoading: boolean;

  form = new FormGroup({
    group: new FormControl(false, c => c.value === false ? { "error": true } : null)
  });

  constructor(private groupService: GroupService) {}

  open() {
    this.modal.open();
  }

  close() {
    this.modal.close();
  }

  submit() {
    this.isLoading = true;

    this.subscription.add(
      this.groupService.addPositionsInGroup(
        this.request.id,
        this.form.get('group').value.id,
        this.positions.map(position => position.id)
      ).pipe(
        finalize(() => {
          this.isLoading = false;
          this.form.reset();
          this.close();
        })
      ).subscribe(groupWithPositions => this.success.emit(groupWithPositions))
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
