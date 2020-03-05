import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  ContentChild,
  ContentChildren,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostBinding,
  HostListener,
  Input,
  OnDestroy,
  Output,
  QueryList,
  Renderer2, TemplateRef,
  ViewChild, ViewContainerRef
} from '@angular/core';
import { AbstractControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator } from "@angular/forms";
import { flatMap, mergeAll, startWith } from "rxjs/operators";
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
  @HostBinding('class.app-control-wrap') appControlWrap = true;
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

  public inputValue = null;
  public value = null;
  public isHidden = true;
  public onTouched: (value) => void;
  public onChange: (value) => void;
  public subscription = new Subscription();

  get itemsWrapper(): HTMLDivElement | null {
    return this.itemsWrapperRef ? this.itemsWrapperRef.nativeElement : null;
  }

  constructor(private renderer: Renderer2, public el: ElementRef,
    private viewContainer: ViewContainerRef,
  ) {}

  registerOnChange = (fn: any) => this.onChange = fn;
  registerOnTouched = (fn: any) => this.onTouched = fn;
  setDisabledState = (isDisabled: boolean) => this.disabled = isDisabled;
  writeValue (value: any) {
    this.value = value;
    this.inputValue = null;
  }

  ngAfterViewChecked() {
    this.renderer.setStyle(this.itemsWrapper, 'width', this.el.nativeElement.offsetWidth + "px");
  }

  ngAfterViewInit() {
    this.subscription.add(this.items.changes.pipe(
      startWith(this.items),
      flatMap(items => items.map(item => item.onSelect)),
      mergeAll<UxgDropdownItemData>()
    )
      .subscribe(data => {
        this.writeValue(data.value);
        this.inputValue = data.label;
        this.select.emit({value: data.value, label: data.label});

        if (this.onChange) {
          this.onChange(data.value);
        }

        if (this.hideAfterSelect) {
          this.isHidden = true;
        }
      })
    );

  }

  @HostListener('document:click', ['$event.target'])
  clickOut(targetElement) {
    if (!this.isHidden && !this.isInside(targetElement)) {
      this.isHidden = true;
    }
  }

  toggle(state: boolean) {
    if (!this.is(this.disabled)) {
      this.isHidden = !state;
    }
  }

  input(e: Event) {
    const value = (e.target as HTMLInputElement).value;
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
    if (this.strictMode && !this.inputValue) {
      return {"not_from_list": true};
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
