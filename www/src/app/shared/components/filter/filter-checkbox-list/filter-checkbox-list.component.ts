import { Component, forwardRef, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ControlValueAccessor, FormBuilder, FormGroup, NG_VALUE_ACCESSOR } from "@angular/forms";
import { Observable, Subject } from "rxjs";
import { distinctUntilChanged, filter, takeUntil, tap } from "rxjs/operators";

@Component({
  selector: 'app-filter-checkbox-list',
  templateUrl: './filter-checkbox-list.component.html',
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => FilterCheckboxListComponent), multi: true }]
})
export class FilterCheckboxListComponent implements ControlValueAccessor, OnInit, OnDestroy {
  @Input() items$: Observable<{ value: unknown, label: string | number }[]>;
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

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.items$.pipe(takeUntil(this.destroy$)).subscribe(items => this.buildForm(items));

    this.searchControl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(this.search);
  }

  buildForm(items) {
    this.formArray.controls = []; // can't use clear() coz https://github.com/angular/angular/issues/23336
    items?.map(({ label, value }) => this.fb.group({ checked: this.value?.indexOf(value) >= 0, label, value })).forEach(formGroup => {
      this.formArray.controls.push(formGroup); // https://github.com/angular/angular/issues/23336#issuecomment-543209703
      this.formArray['_registerControl'](formGroup);
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
