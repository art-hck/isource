import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostBinding,
  Inject,
  InjectionToken,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Output,
  PLATFORM_ID,
  QueryList,
  Renderer2,
  ViewChild
} from '@angular/core';
import { UxgDropdownItemDirective } from "./uxg-dropdown-item.directive";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { DOCUMENT, isPlatformBrowser } from "@angular/common";
import { flatMap, mergeAll, startWith, takeUntil } from "rxjs/operators";
import { UxgDropdownItem } from "./uxg-dropdown-item";
import { Subject } from "rxjs";

@Component({
  selector: 'uxg-dropdown',
  templateUrl: './uxg-dropdown.component.html',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => UxgDropdownComponent),
    multi: true
  }]
})
export class UxgDropdownComponent implements AfterViewInit, OnDestroy, AfterViewChecked, ControlValueAccessor, OnInit {
  @ContentChildren(UxgDropdownItemDirective) items: QueryList<UxgDropdownItemDirective>;
  @HostBinding('class.app-dropdown') appDropdownClass = true;
  @HostBinding('class.app-dropdown-disabled') get isDisabled() { return this.is(this.disabled); }
  @HostBinding('class.app-dropdown-large') get isLarge() { return this.is(this.lg); }
  @ViewChild('itemsWrapper') itemsWrapperRef: ElementRef;
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
  private destroy$ = new Subject();

  registerOnChange = fn => this.onChange = fn;
  registerOnTouched = fn => this.onTouched = fn;
  setDisabledState = isDisabled => this.disabled = isDisabled;
  writeValue = value => this.value = value;
  clickOut = (e: Event) => {
    if (!this.isHidden && !this.isInside(e.target)) {
      this.ngZone.run(() => this.isHidden = true);
      this.cdr.detectChanges();
    }
  }

  get coords() {
    return this.el.nativeElement.getBoundingClientRect();
  }

  get itemsWrapper(): HTMLDivElement | null {
    return this.itemsWrapperRef ? this.itemsWrapperRef.nativeElement : null;
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
        window.removeEventListener('scroll', this.updatePosition, true);
        window.removeEventListener('resize', this.updatePosition, true);
      } else {
        window.addEventListener('scroll', this.updatePosition, true);
        window.addEventListener('resize', this.updatePosition, true);
      }
    }
    this._isHidden = value;
  }

  constructor(
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: InjectionToken<Object>,
    private renderer: Renderer2, public el: ElementRef,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
    this.ngZone.runOutsideAngular(() => this.document.addEventListener('click', this.clickOut));
  }

  ngAfterViewChecked() {
    this.setPosition(this.itemsWrapper, this.isDirectionUp);
  }

  ngAfterViewInit() {
    this.document.body.appendChild(this.itemsWrapper);

    this.items.changes.pipe(
      startWith(this.items),
      flatMap(items => items.map(item => item.onSelect)),
      mergeAll<UxgDropdownItem>(),
      takeUntil(this.destroy$)
    )
      .subscribe(({label, value}) => {
        this.writeValue(value);
        this.select.emit({value, label});
        if (this.onChange) { this.onChange(value); }
        if (this.hideAfterSelect) { this.isHidden = true; }
      });
  }

  toggle() {
    if (!this.is(this.disabled)) {
      this.isHidden = !this.isHidden;
    }
  }

  updatePosition = () => {
    this.setPosition(this.itemsWrapper, this.isDirectionUp);
  }

  private is = (prop?: boolean | string) => prop !== undefined && prop !== false;

  private isInside(targetElement): boolean {
    return this.el.nativeElement.contains(targetElement) || this.itemsWrapper.contains(targetElement);
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
    this.document.removeEventListener('click', this.clickOut);
    if (isPlatformBrowser(this.platformId)) {
      this.itemsWrapper.remove();
    }

    this.destroy$.next();
    this.destroy$.complete();
  }
}
