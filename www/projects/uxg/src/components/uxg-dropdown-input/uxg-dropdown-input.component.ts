import { AfterViewChecked, AfterViewInit, Component, ContentChild, ContentChildren, ElementRef, EventEmitter, forwardRef, HostBinding, HostListener, Input, OnDestroy, Output, QueryList, Renderer2, TemplateRef, ViewChild } from '@angular/core';
import { AbstractControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator } from "@angular/forms";
import { flatMap, mergeAll, startWith, tap } from "rxjs/operators";
import { Subscription } from "rxjs";
import { UxgDropdownItemDirective } from "../uxg-dropdown/uxg-dropdown-item.directive";
import { UxgDropdownItemData } from "../uxg-dropdown/uxg-dropdown-item-data";

@Component({
  selector: 'uxg-dropdown-input',
  templateUrl: './uxg-dropdown-input.component.html',
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => UxgDropdownInputComponent), multi: true },
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => UxgDropdownInputComponent), multi: true }
  ]
})
export class UxgDropdownInputComponent implements AfterViewInit, OnDestroy, AfterViewChecked, ControlValueAccessor, Validator {
  @ContentChildren(UxgDropdownItemDirective) items: QueryList<UxgDropdownItemDirective>;
  @ContentChild('errors', {static: false, read: TemplateRef }) errors: TemplateRef<ElementRef>;
  @HostBinding('class.app-dropdown') appDropdownClass = true;
  @HostBinding('class.app-control-wrap') @Input() appControlWrap = true;
  @HostBinding('class.app-dropdown-disabled') get isDisabled() { return this.is(this.disabled); }
  @ViewChild('itemsWrapper', { static: false }) itemsWrapperRef: ElementRef;
  @Output() select = new EventEmitter();
  @Output() focus = new EventEmitter();
  @Input() hideAfterSelect = true;
  @Input() lg = false;
  @Input() placeholder = "";
  @Input() disabled: boolean;
  @Input() strictMode = false;
  @Input() warning = false;
  @Input() displayByFn: (val: any) => string;

  public inputValue = null;
  public value = null;
  public isHidden = true;
  public onTouched: (value) => void;
  public onChange: (value) => void;
  public subscription = new Subscription();
  public isCustomValue = false;

  get itemsWrapper(): HTMLDivElement | null {
    return this.itemsWrapperRef ? this.itemsWrapperRef.nativeElement : null;
  }

  constructor(private renderer: Renderer2, public el: ElementRef) {}

  registerOnChange = (fn: any) => this.onChange = fn;
  registerOnTouched = (fn: any) => this.onTouched = fn;
  setDisabledState = (isDisabled: boolean) => this.disabled = isDisabled;
  writeValue = (value: any) => this.value = value;

  ngAfterViewChecked() {
    this.renderer.setStyle(this.itemsWrapper, 'width', this.el.nativeElement.offsetWidth + "px");
  }

  ngAfterViewInit() {
    this.subscription.add(this.items.changes.pipe(
      startWith(this.items),
      tap((items) => this.toggle(items.length > 0)),
      flatMap(items => items.map(item => item.onSelect)),
      mergeAll<UxgDropdownItemData>()
    )
      .subscribe(data => {
        this.isCustomValue = false;
        this.writeValue(data.value);
        this.select.emit({ value: data.value, label: data.label });

        if (this.onChange) {
          this.onChange(data.value);
        }

        if (this.hideAfterSelect) {
          this.toggle(false);
        }
      })
    );

    this.subscription.add(
      this.focus.subscribe(value => this.toggle(this.items.length > 0))
    );
  }

  @HostListener('document:click', ['$event.target'])
  clickOut(targetElement) {
    if (!this.isHidden && !this.isInside(targetElement)) {
      this.toggle(false);
    }
  }

  toggle(state: boolean) {
    if (!this.is(this.disabled)) {
      this.isHidden = !state;
    }
  }

  input(e: Event) {
    const value = (e.target as HTMLInputElement).value;
    this.isCustomValue = true;
    this.writeValue(value);

    if (this.onChange) {
      this.onChange(value);
    }
  }

  private is = (prop?: boolean | string) => prop !== undefined && prop !== false;

  private isInside(targetElement): boolean {
    return this.el.nativeElement.contains(targetElement) || this.itemsWrapper.contains(targetElement);
  }

  validate(control: AbstractControl): ValidationErrors | null {
    if (this.strictMode && this.isCustomValue && control.value) {
      return {"notFromList": true};
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
