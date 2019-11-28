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
    selected: new FormControl(false),
    positions: new FormArray([])
  });

  get isMixedSelected(): boolean {
    return this.selectedPositions.length > 0 && this.selectedPositions.length < this.formPositionsFlat.length;
  }

  get selectedPositions(): RequestPosition[] {
    return this.formPositionsFlat
      .map(formGroup => formGroup.value)
      .filter(value => value.selected)
      .map(value => value.position)
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
          positions.forEach(position => {
              this.formPositionPush(position);
          });
        }),
        publishReplay(1), refCount()
      )
    ;
    this.flatPositions$ = this.requestService.getRequestPositionsFlat(this.positions$);

    this.subscription.add(
      this.form.get('selected').valueChanges.subscribe(value =>
        this.formPositionsFlat.forEach(
          formGroup => formGroup.get('selected').setValue(value)
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

  navigateToPosition(position: RequestPositionList, e: MouseEvent, controlCheckbox) {
    if (!controlCheckbox.contains || !controlCheckbox.contains(e.target)) {
      this.router.navigate([position.id], { relativeTo: this.route });
      e.preventDefault();
    }
  }


  check(e, controlCheckbox) {
    controlCheckbox.click();
    e.preventDefault();
    e.stopPropagation();
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
    const selectedControl = new FormControl(false);

    const formGroup = new FormGroup({
      position: new FormControl(position),
      selected: selectedControl,
      positions: new FormArray([])
    });

    this.subscription.add(selectedControl.valueChanges
      .subscribe(checked => {
        setTimeout(() => {
          const parentFormGroup = formGroup.parent.parent;
          const selectedCount = parentFormGroup.get("positions").value.filter(value => value.selected);

          parentFormGroup.get("selected").setValue(
            selectedCount.length > 0, { emitEvent: false }
          );
        });

        // Царь-чекбокс для групп
        (formGroup.get("positions") as FormArray).controls
          .forEach(_formGroup => _formGroup.get("selected").setValue(checked));

      }
    ));

    return formGroup;
  }



  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  test() {
    console.log(this.selectedPositions);
  }
}
