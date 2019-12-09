import { AfterViewInit, ChangeDetectorRef, Component, ContentChildren, ElementRef, EventEmitter, forwardRef, HostBinding, HostListener, Inject, Input, OnDestroy, OnInit, Output, QueryList, Renderer2, ViewChild } from '@angular/core';
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
  public isHidden = true;
  public onTouched: (value: boolean) => void;
  public onChange: (value: boolean) => void;
  public isDisabled: boolean;

  private _coords;
  get coords(): ClientRect {
    // Avoid ExpressionChangedAfterItHasBeenCheckedError
    if (JSON.stringify(this._coords) !== JSON.stringify(this.el.nativeElement.getBoundingClientRect())) {
      this._coords = this.el.nativeElement.getBoundingClientRect();
      this.cdr.detectChanges();
    }
    return this._coords;
  }

  get width(): number | null {
    return this.el.nativeElement.offsetWidth;
  }

  get selected(): UxgDropdownItemDirective | null {
    return this.items.find(item => item.value === this.value);
  }

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    private el: ElementRef,
    private cdr: ChangeDetectorRef
  ) {}

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
      item.onSelect.subscribe(value => {
        this.writeValue(value);
        this.select.emit(value);

        if (this.onChange) {
          this.onChange(value);
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
    this.dropdownItems.nativeElement.remove();
  }
}
