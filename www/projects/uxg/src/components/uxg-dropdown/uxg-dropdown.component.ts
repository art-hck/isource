import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, ContentChildren, ElementRef, EventEmitter, forwardRef, HostBinding, HostListener, Inject, InjectionToken, Input, OnDestroy, Output, PLATFORM_ID, QueryList, Renderer2, ViewChild } from '@angular/core';
import { UxgDropdownItemDirective } from "./uxg-dropdown-item.directive";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { DOCUMENT, isPlatformBrowser } from "@angular/common";
import { flatMap, mergeAll, startWith } from "rxjs/operators";
import { Subscription } from "rxjs";
import { UxgDropdownItem } from "./uxg-dropdown-item";

@Component({
  selector: 'uxg-dropdown',
  templateUrl: './uxg-dropdown.component.html',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => UxgDropdownComponent),
    multi: true
  }]
})
export class UxgDropdownComponent implements AfterViewInit, OnDestroy, AfterViewChecked, ControlValueAccessor {
  @ContentChildren(UxgDropdownItemDirective) items: QueryList<UxgDropdownItemDirective>;
  @HostBinding('class.app-dropdown') appDropdownClass = true;
  @HostBinding('class.app-dropdown-disabled') get isDisabled() { return this.is(this.disabled); }
  @HostBinding('class.app-dropdown-large') get isLarge() { return this.is(this.lg); }
  @ViewChild('itemsWrapper', { static: false }) itemsWrapperRef: ElementRef;
  @Output() select = new EventEmitter();
  @Input() lg: boolean | string;
  @Input() hideAfterSelect = true;
  @Input() placeholder = "";
  @Input() disabled: boolean;
  @Input() direction: "up" | "down";

  public value = null;
  private _isHidden = true;
  public onTouched: (value: boolean) => void;
  public onChange: (value: boolean) => void;
  public subscription = new Subscription();

  get itemsWrapper(): HTMLDivElement | null {
    return this.itemsWrapperRef ? this.itemsWrapperRef.nativeElement : null;
  }

  get coords(): ClientRect {
    return this.el.nativeElement.getBoundingClientRect();
  }

  get windowHeight() {
    return isPlatformBrowser(this.platformId) ? window.innerHeight : 0;
  }

  get scrollTop() {
    return isPlatformBrowser(this.platformId) ? window.pageYOffset : null;
  }

  get isDirectionUp() {
    if (this.itemsWrapper) {
      return this.direction === "up" || this.windowHeight < this.coords.bottom + this.itemsWrapper.offsetHeight;
    }
  }

  get selected(): UxgDropdownItemDirective | null {
    return this.items ? this.items.find(item => item.value === this.value) : null;
  }

  get isHidden(): boolean {
    return this._isHidden;
  }

  set isHidden(value: boolean) {
    if (isPlatformBrowser(this.platformId)) {
      if (value) {
        window.removeEventListener('scroll', this.hideOnScrollOutside, true);
      } else {
        window.addEventListener('scroll', this.hideOnScrollOutside, true);
      }
    }
    this._isHidden = value;
  }

  constructor(
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: InjectionToken<Object>,
    private renderer: Renderer2, public el: ElementRef,
    private cdr: ChangeDetectorRef
  ) {
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  writeValue(value: any): void {
    this.value = value;
  }

  ngAfterViewChecked() {
    this.setPosition(this.itemsWrapper, this.isDirectionUp);
  }

  ngAfterViewInit() {
    this.document.body.appendChild(this.itemsWrapper);

    this.subscription.add(this.items.changes.pipe(
      startWith(this.items),
      flatMap(items => items.map(item => item.onSelect)),
      mergeAll<UxgDropdownItem>()
    )
      .subscribe(data => {
        this.writeValue(data.value);
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

  toggle() {
    if (!this.is(this.disabled)) {
      this.isHidden = !this.isHidden;
    }
  }

  private is = (prop?: boolean | string) => prop !== undefined && prop !== false;

  private isInside(targetElement): boolean {
    return this.el.nativeElement.contains(targetElement) || this.itemsWrapper.contains(targetElement);
  }

  private hideOnScrollOutside = (e) => {
    if (!this.isHidden && !this.isInside(e.target)) {
      this.isHidden = true;
    }
  }

  private setPosition(el, isDirectionUp: boolean = false): void {
    if (isDirectionUp) {
      this.renderer.setStyle(el, 'bottom', (this.windowHeight - this.scrollTop - this.coords.bottom + this.el.nativeElement.offsetHeight - 2) + "px");
      this.renderer.removeStyle(el, 'top');
    } else {
      this.renderer.setStyle(el, 'top', (this.coords.top + this.scrollTop + this.el.nativeElement.offsetHeight - 1) + "px");
      this.renderer.removeStyle(el, 'bottom');
    }

    this.renderer.setStyle(el, 'width', this.el.nativeElement.offsetWidth + "px");
    this.renderer.setStyle(el, 'left', this.coords.left + "px");

    this.cdr.detectChanges();
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId)) {
      this.itemsWrapper.remove();
    }

    this.subscription.unsubscribe();
  }
}
