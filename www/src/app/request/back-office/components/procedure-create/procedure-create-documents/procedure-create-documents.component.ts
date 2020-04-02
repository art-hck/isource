import { AfterContentInit, Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, FormArray, FormBuilder, FormGroup, NG_VALUE_ACCESSOR } from "@angular/forms";
import { RequestDocument } from "../../../../common/models/request-document";
import { Uuid } from "../../../../../cart/models/uuid";

@Component({
  selector: 'app-request-procedure-create-documents',
  templateUrl: './procedure-create-documents.component.html',
  styleUrls: ['./procedure-create-documents.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => ProcedureCreateDocumentsComponent),
    multi: true
  }]
})
export class ProcedureCreateDocumentsComponent implements AfterContentInit, ControlValueAccessor {
  @Input() documents: RequestDocument[];
  public onTouched: (value) => void;
  public onChange: (value) => void;
  public form: FormGroup;
  public value: Uuid[];

  constructor(private fb: FormBuilder) {}

  get formDocuments() {
    return this.form.get("documents") as FormArray;
  }

  ngAfterContentInit() {
    this.form = this.fb.group({
      documents: this.fb.array(this.documents.map(document => this.fb.group({
        checked: this.value && !!this.value.find(id => document.id === id),
        document })))
    });

    this.form.valueChanges.subscribe(value => {
      const documentIds = this.formDocuments.value.filter(data => data.checked).map(data => data.document.id);
      this.writeValue(documentIds);
      this.onChange(documentIds);
    });
  }

  registerOnChange(fn: any): void { this.onChange = fn; }
  registerOnTouched(fn: any): void { this.onTouched = fn; }
  writeValue(value): void { this.value = value; }
}
