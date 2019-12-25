import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Request } from "../../../../common/models/request";

@Component({
  selector: 'app-request-technical-proposals-create',
  templateUrl: './request-technical-proposals-create.component.html',
  styleUrls: ['./request-technical-proposals-create.component.scss']
})
export class RequestTechnicalProposalsCreateComponent implements OnInit {

  @Input() request: Request;
  form: FormGroup;

  get formPositions() {
    return this.form.get('positions') as FormArray;
  }

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.form = this.fb.group({
      name: ["", Validators.required],
      documents: null,
      positions: null
    });

    // Workaround sync with multiple elements per one formControl
    this.formPositions.valueChanges
      .subscribe(v => this.formPositions.setValue(v, {onlySelf: true, emitEvent: false}));
  }

  filesDropped(files: FileList): void {
    this.form.get('documents').setValue([...this.form.get('documents').value || [], ...Array.from(files)]);
  }

  filesSelected(e) {
    this.filesDropped(e.target.files);
    e.target.value = '';
  }

  submit() {
    // @TODO implement!
    console.log(this.form.value);
  }
}
