import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, ContentChild, ContentChildren, ElementRef, EventEmitter, forwardRef, HostBinding, Inject, Input, NgZone, OnDestroy, OnInit, Output, QueryList, Renderer2, TemplateRef, ViewChild } from '@angular/core';
import { AbstractControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator } from "@angular/forms";
import { flatMap, mergeAll, startWith, takeUntil, tap } from "rxjs/operators";
import { Subject } from "rxjs";
import { UxgDropdownItemDirective } from "../uxg-dropdown/uxg-dropdown-item.directive";
import { UxgDropdownItem } from "../uxg-dropdown/uxg-dropdown-item";
import { DOCUMENT } from "@angular/common";

@Component({
  selector: 'uxg-dropdown-input',
  templateUrl: './uxg-dropdown-input.component.html',
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => UxgDropdownInputComponent), multi: true },
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => UxgDropdownInputComponent), multi: true }
  ]
})
export class UxgDropdownInputComponent implements OnInit, AfterViewInit, OnDestroy, AfterViewChecked, ControlValueAccessor, Validator {
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
  @Input() displayByFn: (value) => string;

  public inputValue = null;
  public value = null;
  public isHidden = true;
  public onTouched: (value) => void;
  public onChange: (value) => void;
  public isNotFromList = false;
  public destroy$ = new Subject();

  registerOnChange = fn => this.onChange = fn;
  registerOnTouched = fn => this.onTouched = fn;
  setDisabledState = isDisabled => this.disabled = isDisabled;
  writeValue = value => this.value = value;
  clickOut = (e: Event) => {
    if (!this.isHidden && !this.isInside(e.target)) {
      this.ngZone.run(() => this.toggle(false));
      this.cd.detectChanges();
    }
  }

  get itemsWrapper(): HTMLDivElement | null {
    return this.itemsWrapperRef ? this.itemsWrapperRef.nativeElement : null;
  }

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    private ngZone: NgZone,
    private cd: ChangeDetectorRef,
    public el: ElementRef) {}

  ngOnInit() {
    this.ngZone.runOutsideAngular(() => this.document.addEventListener('click', this.clickOut));
  }

  ngAfterViewChecked() {
    this.renderer.setStyle(this.itemsWrapper, 'width', this.el.nativeElement.offsetWidth + "px");
  }

  ngAfterViewInit() {
    this.items.changes.pipe(
      startWith(this.items),
      tap((items) => this.toggle(this.value && items.length > 0)),
      flatMap(items => items.map(item => item.onSelect)),
      mergeAll<UxgDropdownItem>(),
      takeUntil(this.destroy$)
    )
      .subscribe(({label, value}) => {
        this.isNotFromList = false;
        this.writeValue(value);
        this.select.emit({ value, label });
        if (this.onChange) { this.onChange(value); }
        if (this.hideAfterSelect) { this.toggle(false); }
      });

    this.focus.pipe(takeUntil(this.destroy$)).subscribe(value => this.toggle(this.items.length > 0))
  }

  toggle(state: boolean) {
    if (!this.is(this.disabled)) {
      this.isHidden = !state;
    }
  }

  input(e: Event) {
    const value = (e.target as HTMLInputElement).value;
    this.isNotFromList = true;
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
    if (this.strictMode !== false && this.isNotFromList && control.value) {
      return {"notFromList": true};
    }
  }

  ngOnDestroy() {
    this.document.removeEventListener('click', this.clickOut);
    this.destroy$.next();
    this.destroy$.complete();
  }
}
