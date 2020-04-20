import { Directive, Input, OnDestroy, OnInit, Optional } from '@angular/core';
import { AbstractControl, FormGroup, NgControl } from "@angular/forms";
import { UxgCheckboxComponent } from "./uxg-checkbox.component";
import { Subject } from "rxjs";
import { filter, map, mapTo, takeUntil, tap } from "rxjs/operators";
import { pipeFromArray } from "rxjs/internal/util/pipe";

@Directive({
  selector: '[uxgSelectAllFor]'
})
export class UxgSelectAllDirective implements OnInit, OnDestroy {
  @Input() uxgSelectAllFor: string;
  destroy$ = new Subject();

  constructor(@Optional() private component: UxgCheckboxComponent, private ngControl: NgControl) {}

  ngOnInit() {
    const control: AbstractControl = this.ngControl.control;
    const controlName = Object.keys(control.parent.controls).find(key => control.parent.get(key) === control);
    let listen = true;

    const pipes = (action: (childs: AbstractControl[]) => void) => [
      mapTo(control.parent.get(this.uxgSelectAllFor)),
      filter(Boolean),
      filter(() => listen),
      filter(() => control.enabled),
      tap(() => listen = false),
      map(({controls}) => controls.map(({controls: c}: FormGroup) => c[controlName])),
      tap(action),
      tap((childs: AbstractControl[]) => this.component && (this.component.isMixed = childs.filter(c => c.enabled).length > childs.filter(c => c.value).length)),
      tap(() => listen = true),
      takeUntil(this.destroy$)
    ];

    control.valueChanges.pipe(pipeFromArray(pipes(
      childs => childs.filter(c => !c.disabled).forEach(c => c.setValue(control.value))
    ))).subscribe();

    control.parent.get(this.uxgSelectAllFor).valueChanges.pipe(pipeFromArray(pipes(
      childs => control.setValue(childs.filter(c => c.value).length > 0)
    ))).subscribe();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
