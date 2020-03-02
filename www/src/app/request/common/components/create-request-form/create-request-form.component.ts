import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CreateRequestService } from "../../services/create-request.service";
import { Router } from "@angular/router";
import { UserInfoService } from "../../../../user/service/user-info.service";
import { NotificationService } from "../../../../shared/services/notification.service";
import { finalize, flatMap, mapTo } from "rxjs/operators";
import { RequestService } from "../../../customer/services/request.service";
import { Subscription } from "rxjs";

@Component({
  selector: 'app-create-request-form',
  templateUrl: './create-request-form.component.html',
  styleUrls: ['./create-request-form.component.css']
})
export class CreateRequestFormComponent implements OnInit, OnDestroy {
  form: FormGroup;
  subscription = new Subscription();
  isLoading = false;

  get formPositions() {
    return this.form.get('positions') as FormArray;
  }

  get validPositions() {
    return this.formPositions.controls.filter(control => control.valid);
  }

  constructor(
    private createRequestService: CreateRequestService,
    private requestService: RequestService,
    private formBuilder: FormBuilder,
    private router: Router,
    public user: UserInfoService,
    public notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      'name': [null, Validators.required],
      'positions': this.formBuilder.array([], Validators.required)
    });
    this.pushPosition();
  }

  pushPosition() {
    this.formPositions.push(this.formBuilder.control(null, Validators.required));
  }

  submit(publish = true) {
    const {name, positions} = this.form.value;
    let request$ = this.createRequestService.addRequest(name, positions)
      .pipe(finalize(() => {
        this.isLoading = false;
        this.form.enable();
      }));

    if (publish) {
      request$ = request$.pipe(
        flatMap(request => this.requestService.publishRequest(request.id).pipe(mapTo(request)))
      );
    }

    this.isLoading = true;
    this.form.disable();

    this.subscription.add(
    request$.subscribe(
      data => {
        this.notificationService.toast(publish ? "Заявка опубликована" : "Черновик заявки создан");
        this.router.navigate(["requests/customer", data.id]);
      }
    ));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
