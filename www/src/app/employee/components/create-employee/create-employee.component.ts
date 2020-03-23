import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CustomValidators} from "../../../shared/forms/custom.validators";
import {EmployeeInfoBrief} from "../../models/employee-info";

@Component({
  selector: 'app-create-employee',
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.scss']
})
export class CreateEmployeeComponent implements OnInit {
  @Output() cancel = new EventEmitter();
  @Output() addEmployee = new EventEmitter<EmployeeInfoBrief>();

  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      username: ['', [Validators.required, CustomValidators.email]],
      phone: ['', [Validators.required, CustomValidators.phone]],
      firstName: ['', [Validators.required, CustomValidators.cyrillicName]],
      lastName: ['', [Validators.required, CustomValidators.cyrillicName]],
      middleName: ['', CustomValidators.cyrillicNotRequired],
      position: ['', [Validators.required, CustomValidators.cyrillic]]
    });
  }

  onCancel() {
    this.cancel.emit();
    this.form.reset();
  }

  onAddEmployee() {
    const form = this.form.value;
    this.addEmployee.emit(form);
    this.form.reset();
  }
}
