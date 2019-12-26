import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidationErrors, Validators } from "@angular/forms";
import { Request } from "../../../../common/models/request";

@Component({
  selector: 'app-request-technical-proposals-create',
  templateUrl: './request-technical-proposals-create.component.html',
  styleUrls: ['./request-technical-proposals-create.component.scss']
})
export class RequestTechnicalProposalsCreateComponent implements OnInit {

  @Input() request: Request;
  form: FormGroup;

  get formDocuments() {
    return this.form.get('documents') as FormArray;
  }

  get isManufacturerPristine(): boolean {
    return this.form.get("positions").value.filter(pos => pos.manufacturer_name).length === 0;
  }

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.form = this.fb.group({
      name: ["", Validators.required],
      documents: this.fb.array([]),
      positions: [[], Validators.required]
    });

    this.form.valueChanges.subscribe(() => {
      this.form.get('positions').setValidators(
        this.formDocuments.value.length > 0 && this.isManufacturerPristine ?
          [Validators.required] :
          [Validators.required, this.positionsValidator]
      );

      this.form.get('positions').updateValueAndValidity({ emitEvent: false });
    });

    // Workaround sync with multiple elements per one formControl
    this.form.get('positions').valueChanges
      .subscribe(v => this.form.get('positions').setValue(v, {onlySelf: true, emitEvent: false}));
  }

  filesDropped(files: FileList): void {
    Array.from(files).forEach(
      file => this.formDocuments.push(this.fb.control(file))
    );
  }

  filesSelected(e) {
    this.filesDropped(e.target.files);
    e.target.value = '';
  }

  submit() {
    console.log(this.form.value);
  }

  positionsValidator(control: AbstractControl): ValidationErrors | null {
    return control.value.length === control.value
      .filter(pos => pos.manufacturer_name).length ? null : { manufacturer_name_error: true };
  }
}
