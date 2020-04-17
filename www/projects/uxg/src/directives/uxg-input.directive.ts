import { Directive, ElementRef, HostBinding, HostListener, Input, OnInit, Optional } from '@angular/core';
import { AbstractControl, NgControl } from "@angular/forms";
import { Subscription } from "rxjs";

@Directive({
  selector: '[uxgInput], [uxgInput][lg]',
})
export class UxgInputDirective implements OnInit {
  @Input() lg: boolean | string;
  @Input() warning: boolean | string;
  @HostBinding('class.app-control') classInput = true;
  @HostBinding('class.app-control-large') get isLarge() { return this.is(this.lg); }
  @HostBinding('class.warning') get isWarning() { return this.is(this.warning); }
  @HostBinding('class.app-control-label-shown')
  get labelShown() {
    return this.ngControl?.control.value?.toString().length;
  }

  private subscription: Subscription;

  constructor(private el: ElementRef, @Optional() private ngControl: NgControl) {
  }

  ngOnInit() {
    if (this.ngControl) {
      this.subscription = this.ngControl.valueChanges
        .subscribe(() => this.validate(this.ngControl.control));
    }
  }

  @HostListener("blur")
  onBlur() {
    if (this.ngControl && !this.ngControl.control.pristine) {
      this.ngControl.control.markAsTouched();
      this.validate(this.ngControl.control);
    }
  }

  private validate(control: AbstractControl) {
    if (control.touched && control.dirty && control.invalid) {
      this.el.nativeElement.classList.add('invalid');
    } else {
      this.el.nativeElement.classList.remove('invalid');
    }
  }

  private is = (prop?: boolean | string) => prop !== undefined && prop !== false;
}
