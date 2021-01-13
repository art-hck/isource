import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { RequestPosition } from "../../../models/request-position";
import { Request } from "../../../models/request";
import { Observable, Subscription } from "rxjs";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { UserService } from "../../../../../user/service/user.service";
import { User } from "../../../../../user/models/user";
import { RequestService } from "../../../../back-office/services/request.service";
import { shareReplay } from "rxjs/operators";
import { searchUsers } from "../../../../../shared/helpers/search";

@Component({
  selector: 'app-request-add-responsible',
  templateUrl: './request-add-responsible.component.html'
})
export class RequestAddResponsibleComponent implements OnInit, OnDestroy {
  @Input() positions: RequestPosition[] = [];
  @Input() request: Request;
  @Output() setResponsibleUser = new EventEmitter<User>();
  @Output() close = new EventEmitter<User>();
  subscription = new Subscription();
  isLoading: boolean;
  regularBackofficeUsers$: Observable<User[]>;

  form = new FormGroup({
    user: new FormControl(null, Validators.required)
  });

  readonly searchUsers = searchUsers;
  readonly getUserName = ({ fullName, shortName }: User) => fullName ?? shortName;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.regularBackofficeUsers$ = this.userService.getRegularBackofficeUsers(this.request.contragentId).pipe(shareReplay(1));
  }

  submit() {
    this.setResponsibleUser.emit(this.form.get('user').value);
    this.close.emit();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
