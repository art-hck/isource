import { AfterViewInit, Component, ContentChildren, ElementRef, EventEmitter, forwardRef, HostBinding, HostListener, Inject, Input, OnDestroy, OnInit, Output, QueryList, Renderer2, ViewChild } from '@angular/core';
import { UxgDropdownItemDirective } from "../../directives/uxg-dropdown-item.directive";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { DOCUMENT } from "@angular/common";

@Component({
  selector: 'uxg-dropdown',
  templateUrl: './uxg-dropdown.component.html',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => UxgDropdownComponent),
    multi: true
  }]
})
export class UxgDropdownComponent implements AfterViewInit, OnInit, OnDestroy, ControlValueAccessor {
  @ContentChildren(UxgDropdownItemDirective) items: QueryList<UxgDropdownItemDirective>;
  @HostBinding('class.app-dropdown') appDropdownClass = true;
  @ViewChild('dropdownItems', { static: false }) dropdownItems: ElementRef;
  @Output() select = new EventEmitter();
  @Input() hideAfterSelect = true;
  @Input() placeholder = "";

  public value = null;
  public label: string = null;
  public isHidden = true;
  public onTouched: (value: boolean) => void;
  public onChange: (value: boolean) => void;
  public isDisabled: boolean;

  get coords() {
    return this.el.nativeElement.getBoundingClientRect();
  }

  get width() {
    return this.el.nativeElement.offsetWidth;
  }

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2, private el: ElementRef
  ) {
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  writeValue(value: any): void {
    this.value = value;
  }

  ngAfterViewInit() {
    this.document.body.appendChild(this.dropdownItems.nativeElement);
    this.items.forEach(item => {
      item.onSelect.subscribe(data => {
        this.writeValue(data.value);
        this.select.emit(data.value);
        this.label = data.label;

        if (this.onChange) {
          this.onChange(data.value);
        }

        if (this.hideAfterSelect) {
          this.isHidden = true;
        }
      });
    });
  }

  ngOnInit() {
    window.addEventListener('scroll', this.hideOnScrollOutside, true);
  }

  @HostListener('document:click', ['$event.target'])
  clickOut(targetElement) {
    if (!this.isHidden && !this.isInside(targetElement)) {
      this.isHidden = true;
    }
  }

  private isInside(targetElement): boolean {
    return this.el.nativeElement.contains(targetElement) || this.dropdownItems.nativeElement.contains(targetElement);
  }

  private hideOnScrollOutside = (e) => {
    if (!this.isInside(e.target)) {
      this.isHidden = true;
    }
  }

  ngOnDestroy() {
    window.removeEventListener('scroll', () => this.hideOnScrollOutside, true);
  }
}
