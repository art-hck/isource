import { ChangeDetectorRef, Component, ContentChild, forwardRef, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, TemplateRef } from '@angular/core';
import { ControlValueAccessor, FormBuilder, FormGroup, NG_VALUE_ACCESSOR } from "@angular/forms";
import { Observable, Subject } from "rxjs";
import { distinctUntilChanged, filter, takeUntil, tap } from "rxjs/operators";
import { UxgFilterCheckboxList } from "../uxg-filter-checkbox-item";

@Component({
  selector: 'uxg-filter-checkbox-list',
  templateUrl: './uxg-filter-checkbox-list.component.html',
  styleUrls: ['./uxg-filter-checkbox-list.component.scss'],
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => UxgFilterCheckboxListComponent), multi: true }]
})
export class UxgFilterCheckboxListComponent implements ControlValueAccessor, OnInit, OnChanges, OnDestroy {
  @ContentChild(TemplateRef) itemTpl: TemplateRef<any>;
  @Input() items$: Observable<UxgFilterCheckboxList>;
  @Input() limit = 0;
  @Input() folded = true;
  @Input() foldedSearch = false; // Show search input even folded
  @Input() searchPlaceholder = "";
  @Output() search = new Subject<string>();

  readonly formArray = this.fb.array([]);
  readonly searchControl = this.fb.control("");
  readonly destroy$ = new Subject();
  readonly valueChanges$ = this.formArray.valueChanges.pipe(
    distinctUntilChanged(),
    filter(() => !this.formArray.disabled),
    tap(items => this.value = items.filter(({ checked }) => checked).map(({ value }) => value)),
    tap(() => this.onChange(this.value))
  );

  public value;
  public onTouched: (value) => void;
  public onChange: (value) => void;
  registerOnChange = (fn) => this.onChange = fn;
  registerOnTouched = (fn) => this.onTouched = fn;
  setDisabledState = (disabled: boolean) => {
    if (disabled) {
      this.formArray.disable();
      this.searchControl.disable();
    } else {
      this.formArray.enable();
      this.searchControl.enable();
    }
  }

  writeValue = (value) => {
    this.value = value;
    this.formGroups.forEach(formGroup => formGroup.get('checked').setValue(value?.indexOf(formGroup.get('value').value) >= 0));
  }

  get formGroups() {
    return this.formArray.controls as FormGroup[];
  }

  get formGroupsVisible() {
    return this.folded && this.limit ? this.formGroups.filter(g => !g?.get('hideFolded')?.value).slice(0, this.limit) : this.formGroups;
  }

  constructor(private fb: FormBuilder, private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.searchControl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(this.search);
  }

  ngOnChanges({ items$ }: SimpleChanges) {
    if (items$ && this.items$) {
      this.items$.pipe(takeUntil(this.destroy$)).subscribe(items => this.buildForm(items));
    }
  }

  buildForm(items) {
    this.formArray.controls = []; // can't use clear() coz https://github.com/angular/angular/issues/23336
    items?.map((item) => this.fb.group({ checked: this.value?.indexOf(item.value) >= 0, ...item })).forEach(formGroup => {
      this.formArray.controls.push(formGroup); // https://github.com/angular/angular/issues/23336#issuecomment-543209703
      this.formArray['_registerControl'](formGroup);
    });

    this.cd.markForCheck();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
