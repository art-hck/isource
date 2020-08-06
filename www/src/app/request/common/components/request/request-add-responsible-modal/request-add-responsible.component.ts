import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { RequestPosition } from "../../../models/request-position";
import { Request } from "../../../models/request";
import { Observable, Subscription } from "rxjs";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { UserService } from "../../../../../user/service/user.service";
import { User } from "../../../../../user/models/user";
import { RequestService } from "../../../../back-office/services/request.service";
import { finalize } from "rxjs/operators";

@Component({
  selector: 'app-request-add-responsible',
  templateUrl: './request-add-responsible.component.html'
})
export class RequestAddResponsibleComponent implements OnInit, OnDestroy {
  @Input() positions: RequestPosition[] = [];
  @Input() request: Request;
  @Output() success = new EventEmitter<User>();
  @Output() close = new EventEmitter<User>();
  subscription = new Subscription();
  isLoading: boolean;
  regularBackofficeUsers$: Observable<User[]>;

  form = new FormGroup({
    user: new FormControl(null, Validators.required)
  });

  constructor(
    private userService: UserService,
    private requestService: RequestService
  ) {}

  ngOnInit() {
    this.regularBackofficeUsers$ = this.userService.getRegularBackofficeUsers(this.request.contragentId);
  }

  submit() {
    this.isLoading = true;
    this.subscription.add(
      this.requestService.setResponsibleUser(this.request.id, this.form.get('user').value, this.positions).pipe(
        finalize(() => this.isLoading = false)
      ).subscribe(() => {
          this.success.emit(this.form.get('user').value);
          this.close.emit();
        }
      )
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
