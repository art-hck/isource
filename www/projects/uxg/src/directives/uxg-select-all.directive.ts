import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { FormArray, NgControl } from "@angular/forms";
import { UxgCheckboxComponent } from "../components/uxg-checkbox/uxg-checkbox.component";

@Directive({
  selector: '[uxgSelectAllFor]'
})
export class UxgSelectAllDirective implements OnInit {
  @Input() uxgSelectAllFor: string;

  constructor(private component: UxgCheckboxComponent, private el: ElementRef, private ngControl: NgControl) {}


  ngOnInit() {
    const control = this.ngControl.control;
    const childControls = (control.parent.get(this.uxgSelectAllFor) as FormArray).controls
      .map(childControl => childControl.get(this.ngControl.name));

    control.valueChanges.subscribe(() => {
        childControls.forEach(
          childControl => childControl.setValue(control.value, { emitEvent: false })
        );
        this.updateMixed(childControls);
      }
    );

    childControls.forEach(
      childControl => childControl.valueChanges
        .subscribe(() => {
          control.setValue(childControls.filter(c => c.value).length > 0, { emitEvent: false });
          this.updateMixed(childControls);
        })
    );

  }

  updateMixed(childControls) {
    this.component.isMixed = childControls.length > childControls.filter(c => c.value).length;
  }
}
