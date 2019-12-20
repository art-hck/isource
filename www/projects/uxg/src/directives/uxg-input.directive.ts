import { Directive, ElementRef, HostBinding, HostListener, Input, OnInit } from '@angular/core';
import { AbstractControl, NgControl } from "@angular/forms";
import { Subscription } from "rxjs";

@Directive({
  selector: '[uxgInput], [uxgInput][lg]',
})
export class UxgInputDirective implements OnInit {
  @Input() lg: boolean | string;
  @HostBinding('class.app-control') classInput = true;
  @HostBinding('class.app-control-large') get isLarge() { return this.is(this.lg); }
  @HostBinding('class.app-control-label-shown')
  get labelShown() {
    const value = this.ngControl.control.value;
    return value !== null && value.toString().length;
  }

  // true, если хотя бы 1 раз был onBlur
  private wasBlured = false;
  private subscription: Subscription;

  constructor(private el: ElementRef, private ngControl: NgControl) {
  }

  ngOnInit() {
    this.subscription = this.ngControl.valueChanges.subscribe(
      () => this.validate(this.ngControl.control)
    );

    const reset = this.ngControl.control.reset.bind(this.ngControl.control);
    this.ngControl.control.reset = (value?: any, options?: Object) => {
      this.wasBlured = false;
      reset(value, options);
    };
  }

  @HostListener("blur")
  onBlur() {
    if (!this.wasBlured && !this.ngControl.control.pristine) {
      this.wasBlured = true;
      this.validate(this.ngControl.control);
    }
  }

  private validate(control: AbstractControl) {
    if (this.wasBlured && !control.pristine && control.errors && (control.touched || control.dirty)) {
      this.el.nativeElement.classList.add('invalid');
    } else {
      this.el.nativeElement.classList.remove('invalid');
    }
  }

  private is = (prop?: boolean | string) => prop !== undefined && prop !== false;
}
