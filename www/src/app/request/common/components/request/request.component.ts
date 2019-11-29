import { ActivatedRoute, Router } from "@angular/router";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormArray, FormControl, FormGroup } from "@angular/forms";
import { Observable, Subscription } from "rxjs";
import { publishReplay, refCount, tap } from "rxjs/operators";
import { Request } from "../../models/request";
import { RequestGroup } from "../../models/request-group";
import { RequestPosition } from "../../models/request-position";
import { RequestPositionList } from "../../models/request-position-list";
import { RequestService } from "../../../customer/services/request.service";
import { Uuid } from "../../../../cart/models/uuid";

@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.scss']
})
export class RequestComponent implements OnInit, OnDestroy {
  requestId: Uuid;
  request$: Observable<Request>;
  positions$: Observable<RequestPositionList[]>;
  flatPositions$: Observable<RequestPosition[]>;
  subscription = new Subscription();

  form = new FormGroup({
    checked: new FormControl(false),
    positions: new FormArray([])
  });

  get isMixedChecked(): boolean {
    return this.checkedPositions.length > 0 && this.checkedPositions.length < this.formPositionsFlat.length;
  }

  get checkedPositions(): RequestPosition[] {
    return this.formPositionsFlat
      .filter(formGroup => formGroup.get("checked").value)
      .map(formGroup => formGroup.get("position").value)
    ;
  }

  get formPositions(): FormArray {
    return this.form.get('positions') as FormArray;
  }

  get formPositionsFlat() {
    return this.formPositions.controls
      .reduce((arr, formGroup) => {
        if (formGroup && formGroup.get("positions").value.length > 0) {
          return [...arr, ...(formGroup.get("positions") as FormArray).controls];
        }
        return [...arr, formGroup];
      }, [])
      .filter(formGroup => this.asPosition(formGroup.get("position").value));
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private requestService: RequestService,
  ) {
  }

  ngOnInit() {
    this.requestId = this.route.snapshot.paramMap.get('id');

    this.request$ = this.requestService.getRequestInfo(this.requestId);
    this.positions$ = this.requestService.getRequestPositions(this.requestId)
      .pipe(
        tap(positions => {
          // Иницилизация позиций в форме
          positions.forEach(position => this.formPositionPush(position));
        }),
        publishReplay(1), refCount()
      )
    ;
    this.flatPositions$ = this.requestService.getRequestPositionsFlat(this.positions$);

    this.subscription.add(
      this.form.get('checked').valueChanges.subscribe(checked =>
        this.formPositions.controls.forEach(
          formGroup => formGroup.get("checked").setValue(checked)
        )
      )
    );
  }

  asGroup(positionList: RequestPositionList): RequestGroup | null {
    return positionList.entityType !== 'GROUP' ? null : positionList as RequestGroup;
  }

  asPosition(positionList: RequestPositionList): RequestPosition | null {
    return positionList.entityType !== 'POSITION' ? null : positionList as RequestPosition;
  }

  navigateToPosition(position: RequestPositionList, e: MouseEvent): void {
    if (!(e.target instanceof HTMLInputElement)) {
      this.router.navigate([position.id], { relativeTo: this.route });
      e.preventDefault();
    }
  }

  private formPositionPush(position): void {
    const formGroup = this.positionToFormGroup(position);

    this.formPositions.push(formGroup);

    if (this.asGroup(position)) {
      this.asGroup(position).positions.forEach(_position => {
        (formGroup.get('positions') as FormArray).push(this.positionToFormGroup(_position));
      });
    }
  }

  private positionToFormGroup(position): FormGroup {
    const checkedControl = new FormControl(false);

    const formGroup = new FormGroup({
      position: new FormControl(position),
      checked: checkedControl,
      positions: new FormArray([])
    });

    this.subscription.add(checkedControl.valueChanges
      .subscribe(checked => {
        setTimeout(() => {
          const parentFormGroup = formGroup.parent.parent;
          const checkedCount = parentFormGroup.get("positions").value.filter(value => value.checked);

          parentFormGroup.get("checked").setValue(
            checkedCount.length > 0, { emitEvent: false }
          );
        });

        // Царь-чекбокс для групп
        (formGroup.get("positions") as FormArray).controls
          .forEach(_formGroup => _formGroup.get("checked").setValue(checked));
      }
    ));

    return formGroup;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
