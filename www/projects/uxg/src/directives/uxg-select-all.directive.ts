import { Directive, Input, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormGroup, NgControl } from "@angular/forms";
import { UxgCheckboxComponent } from "../components/uxg-checkbox/uxg-checkbox.component";
import { merge, Subscription } from "rxjs";
import { filter, tap } from "rxjs/operators";
import { pipeFromArray } from "rxjs/internal/util/pipe";

@Directive({
  selector: '[uxgSelectAllFor]'
})
export class UxgSelectAllDirective implements OnInit, OnDestroy {
  @Input() uxgSelectAllFor: string;
  subscription = new Subscription();

  constructor(private component: UxgCheckboxComponent, private ngControl: NgControl) {}

  ngOnInit() {
    const control: AbstractControl = this.ngControl.control;
    const controlName = Object.keys(control.parent.controls).find(key => control.parent.get(key) === control);
    const formArray: FormArray = control.parent.get(this.uxgSelectAllFor) as FormArray;
    if (!formArray) { return; }
    const childs: AbstractControl[] = formArray.controls.map(
      (formGroup: FormGroup) => formGroup.controls[controlName]
    );
    let subscribed = true;
    if (!childs.length) { return; }

    const pipes = (action: () => void) => [
      filter(() => subscribed),
      filter(() => !control.disabled),
      tap(() => subscribed = false),
      tap(action),
      tap(() => this.component.isMixed = childs.length > childs.filter(c => c.value).length),
      tap(() => subscribed = true)
    ];

    this.subscription.add(control.valueChanges
      .pipe(
        pipeFromArray(pipes(
          () => childs.filter(c => !c.disabled).forEach(c => c.setValue(this.ngControl.value))
        )))
      .subscribe());

    this.subscription.add(merge(...childs.map(c => c.valueChanges))
      .pipe(pipeFromArray(pipes(() => control.setValue(childs.filter(c => c.value).length > 0))))
      .subscribe());
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
