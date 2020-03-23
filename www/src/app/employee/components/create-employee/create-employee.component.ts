import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CustomValidators} from "../../../shared/forms/custom.validators";
import {EmployeeInfoBrief} from "../../models/employee-info";
import {TechnicalProposal} from "../../../request/common/models/technical-proposal";
import {TechnicalProposalsStatus} from "../../../request/common/enum/technical-proposals-status";
import * as moment from "moment";

@Component({
  selector: 'app-create-employee',
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.scss']
})
export class CreateEmployeeComponent implements OnInit {
  @Input() employee: EmployeeInfoBrief;
  @Output() cancel = new EventEmitter();
  @Output() addEmployee = new EventEmitter<EmployeeInfoBrief>();
  @Output() editEmployee = new EventEmitter<EmployeeInfoBrief>();

  form: FormGroup;

  get isEditing(): boolean {
    return !!this.employee;
  }

  constructor(
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      username: [this.defaultEmployeeValue('username', null), [Validators.required, CustomValidators.email]],
      phone: [this.defaultEmployeeValue('phone', null), [Validators.required, CustomValidators.phone]],
      firstName: [this.defaultEmployeeValue('firstName', null), [Validators.required, CustomValidators.cyrillicName]],
      lastName: [this.defaultEmployeeValue('lastName', null), [Validators.required, CustomValidators.cyrillicName]],
      middleName: [this.defaultEmployeeValue('middleName', null)],
      position: [this.defaultEmployeeValue('position', null), [Validators.required, CustomValidators.cyrillic]]
    });
    if (this.isEditing) {
      this.form.get('username').disable();
    }
  }

  onCancel() {
    this.cancel.emit();
    this.form.reset();
  }

  onAddEmployee() {
    const form = this.form.value;
    if (this.isEditing) {
      // Если изменений нет, эмитим событие для закрытия окна и прерываем сабмит
      if (this.form.pristine) {
        this.cancel.emit();
        return;
      }
      this.editEmployee.emit(form);
    } else {
      this.addEmployee.emit(form);
    }
    this.form.reset();
  }

  defaultEmployeeValue = (field: keyof EmployeeInfoBrief, defaultValue: any = "") => this.employee && this.employee[field] || defaultValue;
}
