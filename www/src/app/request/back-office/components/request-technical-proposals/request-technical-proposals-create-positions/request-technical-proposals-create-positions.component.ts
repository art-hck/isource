import { Component, EventEmitter, forwardRef, Input, OnInit, Output } from '@angular/core';
import { Observable } from "rxjs";
import { TechnicalProposalsService } from "../../../services/technical-proposals.service";
import { Request } from "../../../../common/models/request";
import { AbstractControl, ControlValueAccessor, FormArray, FormBuilder, FormGroup, NG_VALUE_ACCESSOR } from "@angular/forms";
import { RequestPositionList } from "../../../../common/models/request-position-list";
import { tap } from "rxjs/operators";
import { CustomValidators } from "../../../../../shared/forms/custom.validators";
import { PositionWithManufacturerName } from "../../../models/position-with-manufacturer-name";
import { RequestPosition } from "../../../../common/models/request-position";

@Component({
  selector: 'app-request-technical-proposals-create-positions',
  templateUrl: './request-technical-proposals-create-positions.component.html',
  styleUrls: ['./request-technical-proposals-create-positions.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => RequestTechnicalProposalsCreatePositionsComponent),
    multi: true
  }]
})
export class RequestTechnicalProposalsCreatePositionsComponent implements OnInit, ControlValueAccessor {
  @Input() request: Request;
  @Output() cancel = new EventEmitter();
  public onTouched: (value) => void;
  public onChange: (value) => void;
  public positions$: Observable<RequestPositionList[]>;
  public form: FormGroup;
  public value: PositionWithManufacturerName[];

  get formPositions() {
    return this.form.get('positions') as FormArray;
  }

  get checkedFormPositions() {
    return this.formPositions.controls.filter(control => control.get("checked").value);
  }

  constructor(
    private technicalProposalsService: TechnicalProposalsService,
    private fb: FormBuilder
  ) {
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  ngOnInit() {
    this.form = this.fb.group({
      search: "",
      checked: false,
      positions: this.fb.array([], CustomValidators.oneOrMoreSelected)
    });

    this.positions$ = this.technicalProposalsService.getTechnicalProposalsPositionsList(this.request.id).pipe(
      tap(positions => positions.map(position => this.formPositions.push(
        this.createFormGroupPosition(position)
      )))
    );
  }

  createFormGroupPosition(position: RequestPositionList) {
    return this.fb.group({
      checked: false,
      manufacturer_name: null,
      position: position
    });
  }

  writeValue(value): void {
    this.value = value;
  }

  submit(controls: AbstractControl[]) {
    const value = controls.filter(group => group.get("checked").value).map(control => {
      const existPos = (this.value || []).find(val => val.position === control.get('position').value);
      return {...control.value, ...existPos};
    });
    this.writeValue(value);
    this.onChange(value);
  }

  isFiltered(position: RequestPosition) {
    return position.name.toLowerCase().indexOf(this.form.get("search").value.toLowerCase()) >= 0;
  }
}