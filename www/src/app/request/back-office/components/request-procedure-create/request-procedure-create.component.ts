import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { UxgWizzard, UxgWizzardBuilder } from "uxg";
import { CustomValidators } from "../../../../shared/forms/custom.validators";
import { Request } from "../../../common/models/request";
import { RequestPosition } from "../../../common/models/request-position";
import { ProcedureService } from "../../services/procedure.service";
import { CreateProcedureRequest } from "../../models/create-procedure-request";
import { finalize } from "rxjs/operators";
import { NotificationService } from "../../../../shared/services/notification.service";
import { ContragentList } from "../../../../contragent/models/contragent-list";
import { ContragentService } from "../../../../contragent/services/contragent.service";
import { TechnicalProposalsService } from "../../services/technical-proposals.service";
import { Observable } from "rxjs";

@Component({
  selector: 'app-request-technical-proposals-procedure-create',
  templateUrl: './request-procedure-create.component.html',
  styleUrls: ['./request-procedure-create.component.scss']
})
export class RequestProcedureCreateComponent implements OnInit {
  @Input() request: Request;
  @Output() complete = new EventEmitter();
  contragents$: Observable<ContragentList[]>;
  positions$: Observable<RequestPosition[]>;

  form: FormGroup;
  wizzard: UxgWizzard;
  isLoading: boolean;

  get documents() {
    const positions = this.form.get("positions").value as RequestPosition[];
    return positions.reduce((documents: [], position) => [...documents, ...position.documents], []);
  }

  constructor(
    private fb: FormBuilder,
    private wb: UxgWizzardBuilder,
    private procedureService: ProcedureService,
    private technicalProposalsService: TechnicalProposalsService,
    private contragentService: ContragentService,
    private notificationService: NotificationService,
  ) {}

  ngOnInit() {
    this.positions$ = this.technicalProposalsService.getTechnicalProposalsPositionsList(this.request.id);
    this.contragents$ = this.contragentService.getContragentList();

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
      positions: [[], [Validators.required]],
      properties: null,
      privateAccessContragents: [[]],
      documents: this.fb.group({
        procedureDocuments: [[]], // Документы, относящиеся к заявке
        procedureLotDocuments: [[]], // Документы, относящиеся к позицям
      })
    });

    this.form.get("properties").valueChanges
      .subscribe(properties => {
        if (!properties.publicAccess) {
          this.form.get("privateAccessContragents").setValidators([Validators.required, Validators.minLength(2)]);
        } else {
          this.form.get("privateAccessContragents").clearValidators();
        }

        this.wizzard.get("contragents").disable(properties.publicAccess);
      });
  }

  submit() {
    if (this.form.invalid) {
      return;
    }

    this.isLoading = true;
    this.form.disable();

    const body: CreateProcedureRequest = {
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

  filterPositions(q: string, position: RequestPosition): boolean {
    return position.name.toLowerCase().indexOf(q.toLowerCase()) >= 0;
  }

  filterContragents(q: string, contragent: ContragentList): boolean {
    return contragent.inn.indexOf(q.toLowerCase()) >= 0 || contragent.kpp.indexOf(q.toLowerCase()) >= 0;
  }

  trackById = (item: RequestPosition | ContragentList) => item.id;
}
