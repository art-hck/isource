import { AfterContentInit, Component, ContentChild, EventEmitter, forwardRef, Input, OnDestroy, Output, TemplateRef } from '@angular/core';
import { ControlValueAccessor, FormArray, FormBuilder, FormGroup, NG_VALUE_ACCESSOR } from "@angular/forms";
import { CustomValidators } from "../../forms/custom.validators";
import { Subscription } from "rxjs";

@Component({
  selector: 'select-items-with-search',
  templateUrl: './select-items-with-search.component.html',
  styleUrls: ['./select-items-with-search.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SelectItemsWithSearchComponent),
    multi: true
  }]
})
export class SelectItemsWithSearchComponent implements ControlValueAccessor, AfterContentInit, OnDestroy {
  @Input() items: any[];
  @Input() placeholder = "";
  @Input() trackBy: (item) => any;
  @Input() filterFn: (q, item) => boolean;
  @Input() liveUpdate = true;
  @ContentChild(TemplateRef, {static: false}) rowTplRef: TemplateRef<any>;

  public onTouched: (value) => void;
  public onChange: (value) => void;
  public form: FormGroup;
  public value;
  private subscription = new Subscription();

  get formItems() {
    return this.form.get('items') as FormArray;
  }

  get checkedFormItems() {
    return this.formItems.controls.filter(control => control.get("checked").value);
  }

  constructor(private fb: FormBuilder) {}

  ngAfterContentInit() {
    this.trackBy = this.trackBy || (item => JSON.stringify(item));
    this.form = this.fb.group({
      search: "",
      checked: false,
      items: this.fb.array([], CustomValidators.oneOrMoreSelected)
    });

    this.items.forEach(item => this.formItems.push(
      this.fb.group({
        checked: this.value && !!this.value.find(_item => this.trackBy(_item) === this.trackBy(item)),
        item: item
      })
    ));

    if (this.liveUpdate) {
      this.subscription.add(
        this.form.valueChanges.subscribe(() => this.submit())
      );
    }
  }

  submit() {
    const value = this.formItems.controls
      .filter(group => group.get("checked").value)
      .map(control => control.get('item').value)
      .map(item => ({
        ...item,
        ...this.value && this.value.find(_item => this.trackBy(_item) === this.trackBy(item))
      }));

    this.writeValue(value);
    this.onChange(value);
  }

  registerOnChange = (fn: any): void => this.onChange = fn;
  registerOnTouched = (fn: any): void => this.onTouched = fn;
  writeValue = (value): void => this.value = value;
  ngOnDestroy = () => this.subscription.unsubscribe();
}
