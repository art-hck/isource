import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, ContentChildren, ElementRef, EventEmitter, forwardRef, HostBinding, HostListener, Inject, InjectionToken, Input, OnDestroy, OnInit, Output, PLATFORM_ID, QueryList, Renderer2, ViewChild } from '@angular/core';
import { UxgDropdownItemDirective } from "../../directives/uxg-dropdown-item.directive";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { DOCUMENT, isPlatformBrowser } from "@angular/common";

@Component({
  selector: 'uxg-dropdown',
  templateUrl: './uxg-dropdown.component.html',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => UxgDropdownComponent),
    multi: true
  }]
})
export class UxgDropdownComponent implements AfterViewInit, OnInit, OnDestroy, AfterViewChecked, ControlValueAccessor {
  @ContentChildren(UxgDropdownItemDirective) items: QueryList<UxgDropdownItemDirective>;
  @HostBinding('class.app-dropdown') appDropdownClass = true;
  @HostBinding('class.app-dropdown-disabled') get isDisabled() { return this.is(this.disabled); }
  @ViewChild('itemsWrapper', { static: false }) itemsWrapperRef: ElementRef;
  @Output() select = new EventEmitter();
  @Input() hideAfterSelect = true;
  @Input() placeholder = "";
  @Input() disabled: boolean;
  @Input() direction: "up" | "down";

  public value = null;
  public isHidden = true;
  public onTouched: (value: boolean) => void;
  public onChange: (value: boolean) => void;

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

    this.items.forEach(item => {
      item.onSelect.subscribe(data => {
        this.writeValue(data.value);
        this.select.emit({value: data.value, label: data.label});

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
    if (isPlatformBrowser(this.platformId)) {
      window.addEventListener('scroll', this.hideOnScrollOutside, true);
    }
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
      window.removeEventListener('scroll', this.hideOnScrollOutside, true);
      this.itemsWrapper.remove();
    }
  }
}
