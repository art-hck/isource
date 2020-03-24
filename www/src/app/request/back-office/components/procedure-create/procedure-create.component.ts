import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { UxgWizzard, UxgWizzardBuilder, UxgWizzardStep } from "uxg";
import { CustomValidators } from "../../../../shared/forms/custom.validators";
import { Request } from "../../../common/models/request";
import { RequestPosition } from "../../../common/models/request-position";
import { ProcedureService } from "../../services/procedure.service";
import { ProcedureCreateRequest } from "../../models/procedure-create-request";
import { finalize } from "rxjs/operators";
import { NotificationService } from "../../../../shared/services/notification.service";
import { ContragentList } from "../../../../contragent/models/contragent-list";
import { TextMaskConfig } from "angular2-text-mask/src/angular2TextMask";
import { ContragentShortInfo } from "../../../../contragent/models/contragent-short-info";

@Component({
  selector: 'app-request-procedure-create',
  templateUrl: './procedure-create.component.html',
  styleUrls: ['./procedure-create.component.scss']
})
export class ProcedureCreateComponent implements OnInit {
  @Input() procedure;
  @Input() request: Request;
  @Input() positions: RequestPosition[];
  @Input() contragents: ContragentList[] | ContragentShortInfo[];
  @Input() action: "create" | "prolong" | "bargain" = "create";
  @Input() publicAccess = true;
  @Output() complete = new EventEmitter();
  @Output() updateSelectedPositions = new EventEmitter<RequestPosition[]>();

  form: FormGroup;
  wizzard: UxgWizzard;
  isLoading: boolean;

  mask: TextMaskConfig = {
    mask: value => [/[0-2]/, value[0] === "1" ? /[0-9]/ : /[0-3]/, ' ', ':', ' ', /[0-5]/, /\d/],
    guide: false,
    keepCharPositions: true
  };

  get documents() {
    const positions = this.form.get("positions").value as RequestPosition[];
    return positions.reduce((documents: [], position) => [...documents, ...position.documents], []);
  }

  constructor(
    private fb: FormBuilder,
    private wb: UxgWizzardBuilder,
    private procedureService: ProcedureService,
    private notificationService: NotificationService,
  ) {}

  ngOnInit() {
    this.wizzard = this.wb.create({
      positions: { label: "Выбор позиций", disabled: this.action !== "create", validator: () => this.form.get('positions').valid },
      general: ["Общие сведения", () => this.form.get('general').valid ],
      properties: { label: "Свойства", disabled: this.action === 'prolong' },
      contragents: { label: "Контрагенты", hidden: true, validator: () => this.form.get('privateAccessContragents').valid },
      documents: ["Документы", () => this.form.valid],
    });

    this.form = this.fb.group({
      positions: [[], [Validators.required]],
      general: this.fb.group({
        procedureTitle: [this.defaultProcedureValue("procedureTitle"), [Validators.required, Validators.minLength(3)]],
        dateEndRegistration: [this.defaultProcedureValue("dateEndRegistration"), CustomValidators.futureDate()],
        timeEndRegistration: [this.defaultProcedureValue("timeEndRegistration"), [Validators.required, Validators.pattern(/[0-9]{2} : [0-9]{2}/)]],
        dishonestSuppliersForbidden: this.defaultProcedureValue("dishonestSuppliersForbidden", false),
        prolongateEndRegistration: this.defaultProcedureValue("prolongateEndRegistration", 10), // Продление времени приема заявок на участие (минут)
      }),
      properties: null,
      privateAccessContragents: [ this.defaultProcedureValue("privateAccessContragents", []) ],
      documents: this.fb.group({
        procedureDocuments: [ this.defaultProcedureValue("procedureDocuments", []) ], // Документы, относящиеся к заявке
        procedureLotDocuments: [ this.defaultProcedureValue("procedureLotDocuments", []) ], // Документы, относящиеся к позицям
      })
    });

    if (this.action === 'prolong') {
      this.wizzard.get("positions").disable();
      this.wizzard.get("properties").disable();
      this.form.get("positions").disable();
      this.form.get("properties").disable();
    }

    if (this.action === 'bargain') {
      this.wizzard.get("positions").disable();
      this.form.get("positions").disable();
    }

    this.form.get("positions").valueChanges
      .subscribe(positions => this.updateSelectedPositions.emit(positions));

    this.form.get("properties").valueChanges
      .subscribe(properties => {
        if (!properties.publicAccess) {
          this.form.get("privateAccessContragents").setValidators([Validators.required, Validators.minLength(2)]);
        } else {
          this.form.get("privateAccessContragents").clearValidators();
        }

        this.wizzard.get("contragents").toggle(!properties.publicAccess);
      });
  }

  submit() {
    if (this.form.invalid) {
      return;
    }

    this.isLoading = true;
    this.form.disable();

    const body: ProcedureCreateRequest = {
      ...this.form.get("general").value,
      ...this.form.get("documents").value,
      ...this.form.get("properties").value,
      positions: this.form.get("positions").value.map(position => position.id),
      privateAccessContragents: this.form.get("privateAccessContragents").value.map(contragent => contragent.id),
    };

    this.procedureService.createProcedure(this.request.id, body).pipe(
      finalize(() => {
        this.form.enable();
        this.isLoading = false;
      })
    ).subscribe(
      data => {
        this.complete.emit();
        this.notificationService.toast(`Процедура <b>${ data.procedureId }</b> успешно создана`);
      },
      err => this.notificationService.toast(
        err.error && err.error.detail || "Ошибка при создании процедуры",
        "error", 0)
    );
  }

  getStepIcon<S>(stepInfo: UxgWizzardStep<S>) {
    switch (true) {
      case stepInfo.disabled: return 'app-lock';
      case stepInfo.completed: return 'app-check';
    }
  }

  filterPositions(q: string, position: RequestPosition): boolean {
    return position.name.toLowerCase().indexOf(q.toLowerCase()) >= 0;
  }

  disabledPositions(position: RequestPosition): boolean {
    return position.hasProcedure;
  }

  filterContragents(q: string, contragent: ContragentList): boolean {
    return contragent.inn.indexOf(q.toLowerCase()) >= 0 || contragent.shortName.toLowerCase().indexOf(q.toLowerCase()) >= 0;
  }

  trackById = (item: RequestPosition | ContragentList) => item.id;
  defaultProcedureValue = (field: string, defaultValue: any = "") => this.procedure && this.procedure[field] || defaultValue;
}
