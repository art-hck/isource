import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { UxgWizzard, UxgWizzardBuilder } from "uxg";
import { CustomValidators } from "../../../../shared/forms/custom.validators";
import { Request } from "../../../common/models/request";
import { RequestPosition } from "../../../common/models/request-position";
import { ProcedureService } from "../../services/procedure.service";
import { CreateProcedureRequest } from "../../models/create-procedure-request";

@Component({
  selector: 'app-request-technical-proposals-procedure-create',
  templateUrl: './request-procedure-create.component.html',
  styleUrls: ['./request-procedure-create.component.scss']
})
export class RequestProcedureCreateComponent implements OnInit {
  @Input() request: Request;
  @Output() complete = new EventEmitter();
  form: FormGroup;
  wizzard: UxgWizzard;
  loading: boolean;

  get documents() {
    const positions = this.form.get("positions").value.map(_positions => _positions.position) as RequestPosition[];
    return positions.reduce((documents: [], position) => [...documents, ...position.documents], []);
  }

  constructor(
    private fb: FormBuilder,
    private wb: UxgWizzardBuilder,
    private procedureService: ProcedureService,
  ) {}

  ngOnInit() {
    this.wizzard = this.wb.create({
      positions: "Выбор позиций",
      general: "Общие сведения",
      properties: "Свойства",
      contragents: { label: "Контрагенты", disabled: true },
      documents: "Документы",
    });

    this.form = this.fb.group({
      general: this.fb.group({
        procedureTitle: ["", [Validators.required, Validators.minLength(3)]],
        dateEndRegistration: ["", CustomValidators.futureDate()],
        dishonestSuppliersForbidden: false,
        prolongateEndRegistration: 10, // Продление времени приема заявок на участие (минут)
      }),
      positions: [[]],
      properties: null,
      privateAccessContragents: [[]],
      documents: this.fb.group({
        procedureDocuments: [[]], // Документы, относящиеся к заявке
        procedureLotDocuments: [[]], // Документы, относящиеся к позицям
      })
    });

    this.form.get("properties").valueChanges
      .subscribe(properties => {
        this.wizzard.get("contragents").disable(properties.publicAccess);
      });
  }


  submit() {
    if (this.form.invalid) {
      return;
    }

    this.loading = true;
    this.form.disable();

    const body: CreateProcedureRequest = {
      ...this.form.get("general").value,
      ...this.form.get("documents").value,
      ...this.form.get("properties").value,
      positions: this.form.get("positions").value.map(position => position.position.id),
      privateAccessContragents: this.form.get("privateAccessContragents").value,
    };

    this.procedureService.createProcedure(this.request.id, body).subscribe(data => {
      this.loading = false;
      this.form.enable();
      this.complete.emit();
    });
  }
}
