import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { UxgWizzard, UxgWizzardBuilder, UxgWizzardStep } from "uxg";
import { CustomValidators } from "../../../../shared/forms/custom.validators";
import { Request } from "../../../common/models/request";
import { RequestPosition } from "../../../common/models/request-position";
import { ProcedureService } from "../../services/procedure.service";
import { Procedure } from "../../models/procedure";
import { catchError, debounceTime, filter, finalize, flatMap, takeUntil, tap } from "rxjs/operators";
import { Store } from "@ngxs/store";
import { ContragentList } from "../../../../contragent/models/contragent-list";
import { TextMaskConfig } from "angular2-text-mask/src/angular2TextMask";
import { ContragentShortInfo } from "../../../../contragent/models/contragent-short-info";
import { ToastActions } from "../../../../shared/actions/toast.actions";
import * as moment from "moment";
import { ContragentService } from "../../../../contragent/services/contragent.service";
import { Observable, Subject, throwError } from "rxjs";
import { ProcedureAction } from "../../models/procedure-action";
import { ProcedureSource } from "../../enum/procedure-source";
import { PositionStatus } from "../../../common/enum/position-status";
import { PositionStatusesLabels } from "../../../common/dictionaries/position-statuses-labels";
import { Okpd2Item } from "../../../../core/models/okpd2-item";

@Component({
  selector: 'app-request-procedure-form',
  templateUrl: './procedure-form.component.html',
  styleUrls: ['./procedure-form.component.scss']
})
export class ProcedureFormComponent implements OnInit, OnDestroy {
  @Input() procedure: Partial<Procedure>;
  @Input() request: Request;
  @Input() positions: RequestPosition[];
  @Input() contragents: ContragentList[] | ContragentShortInfo[] = [];
  @Input() action: ProcedureAction["action"] = "create";
  @Input() procedureSource: ProcedureSource = ProcedureSource.COMMERCIAL_PROPOSAL;
  @Output() complete = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Output() updateSelectedPositions = new EventEmitter<RequestPosition[]>();

  form: FormGroup;
  allContragents$: Observable<ContragentList[]>;
  okpd2List$ = new Subject<Okpd2Item[]>();
  wizzard: UxgWizzard;
  isLoading: boolean;

  readonly destroy$ = new Subject();
  readonly timeEndRegistration = this.fb.control("", Validators.required);
  readonly PositionStatusesLabels = PositionStatusesLabels;
  readonly mask: TextMaskConfig = {
    mask: value => [/[0-2]/, value[0] === "2" ? /[0-3]/ : /[0-9]/, ' ', ':', ' ', /[0-5]/, /\d/],
    guide: false,
    keepCharPositions: true
  };
  readonly getOkpd2Name = (okpd2: Okpd2Item) => okpd2.code ? okpd2.code + ' ' + okpd2.name : '';
  readonly searchOkpd2 = (query, items: Okpd2Item[]) => items.filter(item => item.name.toLowerCase().indexOf(query.toLowerCase()) >= 0 || item.code === query).slice(0, 20);

  get documents() {
    const positions = this.form.get("positions").value as RequestPosition[];
    return positions.reduce((documents: [], position) => [...documents, ...position.documents], []);
  }

  constructor(
    private fb: FormBuilder,
    private wb: UxgWizzardBuilder,
    private procedureService: ProcedureService,
    private contragentService: ContragentService,
    private store: Store,
  ) {}

  ngOnInit() {
    this.wizzard = this.wb.create({
      positions: { label: "Выбор позиций", disabled: this.action !== "create", validator: () => this.form.get('positions').valid },
      general: ["Общие сведения", () => this.form.get('general').valid && (!!this.contragents || this.form.get('privateAccessContragents').valid)],
      contragents: { label: "Участники", hidden: true, validator: () => this.form.get('privateAccessContragents').valid },
      properties: { label: "Параметры", disabled: this.action === 'prolong' },
      documents: ["Документы", () => this.form.valid],
    });

    this.form = this.fb.group({
      positions: [this.defaultProcedureValue("positions", []), [Validators.required]],
      general: this.fb.group({
        requestProcedureId: [this.defaultProcedureValue("id")],
        procedureTitle: [this.defaultProcedureValue("procedureTitle"), [Validators.required, Validators.minLength(3)]],
        dateEndRegistration: [null, CustomValidators.currentOrFutureDate()],
        dishonestSuppliersForbidden: this.defaultProcedureValue("dishonestSuppliersForbidden", false),
        publicAccess: [true, Validators.required],
        okpd2: ["", Validators.required],
        prolongateEndRegistration: this.defaultProcedureValue("prolongateEndRegistration", 0), // Продление времени приема заявок на участие (минут)
      }),
      properties: null,
      privateAccessContragents: [ this.defaultProcedureValue("privateAccessContragents", []) ],
      documents: this.fb.group({
        procedureDocuments: [ this.defaultProcedureValue("procedureDocuments", []) ], // Документы, относящиеся к позицям
        procedureUploadDocuments: [ this.defaultProcedureValue("procedureUploadDocuments", [])] // Загруженные документы
      })
    });

    this.form.get('properties').patchValue(this.procedure ?? null);

    if (this.action === 'prolong') {
      this.wizzard.get("positions").disable();
      this.wizzard.get("properties").disable();
      this.form.get("positions").disable();
      this.form.get("properties").disable();
    }

    if (this.action === 'bargain') {
      this.wizzard.get("positions").disable();
      this.wizzard.get("documents").disable();
      this.form.get("positions").disable();
      this.form.get("general.procedureTitle").disable();
      this.form.get("general.dishonestSuppliersForbidden").disable();
      this.form.get("general.okpd2").disable();
    }

    if (!this.form.get("general.publicAccess").value) {
      this.form.get("general.okpd2").disable();
    }

    this.form.get("positions").valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(positions => this.updateSelectedPositions.emit(positions));

    this.form.get("general").valueChanges.pipe(
      tap(({ publicAccess }) => this.form.get("privateAccessContragents").setValidators(
        publicAccess ? null : [Validators.required, Validators.minLength(2)]
      )),
      tap(({ publicAccess }) => this.wizzard.get("contragents").toggle(!publicAccess)),
      takeUntil(this.destroy$)
    ).subscribe();

    this.form.get("general.publicAccess").valueChanges.subscribe(
      selected => {
        selected ? this.form.get("general.okpd2").enable() : this.form.get("general.okpd2").disable();
      }
    );

    this.form.get("general.okpd2").valueChanges.pipe(
      debounceTime(500),
      filter(value => typeof value === 'string'),
      flatMap(value => this.procedureService.getOkpd2(value)),
      tap(v => this.okpd2List$.next(v)),
      takeUntil(this.destroy$)
    ).subscribe();

    this.allContragents$ = this.contragentService.getContragentList();
  }

  submit() {
    if (this.form.invalid) {
      return;
    }

    this.isLoading = true;
    this.form.disable();

    const body: Procedure = {
      ...(this.form.get("general") as FormGroup).getRawValue(),
      ...this.form.get("properties").value,
      okpd2: this.form.get("general.publicAccess").value ? this.form.get("general.okpd2").value.code : "01.11",
      positions: this.form.get("positions").value.map(({id}) => id),
      privateAccessContragents: this.form.get("general.publicAccess").value ? null : this.form.get("privateAccessContragents").value.map(({id}) => id),
      procedureDocuments: this.form.get("documents.procedureDocuments").value.map(({id}) => id),
      procedureUploadDocuments: this.form.get("documents.procedureUploadDocuments").value,
      dateEndRegistration: moment(this.form.get('general.dateEndRegistration').value + " " + this.timeEndRegistration.value, "DD.MM.YYYY HH:mm").toISOString(),
      source: this.procedureSource
    };
    let request$;
    switch (this.action) {
      case "create": request$ = this.procedureService.create(this.request.id, body); break;
      case "bargain": request$ = this.procedureService.bargain(this.request.id, body); break;
    }

    request$.pipe(
      tap(() => this.complete.emit()),
      tap(({procedureId}) => this.store.dispatch(new ToastActions.Success(`Процедура ${ procedureId } успешно отправлена`))),
      catchError(err => {
        this.store.dispatch(new ToastActions.Error(err?.error?.detail || "Ошибка при создании процедуры"));
        return throwError(err);
      }),
      finalize(() => {
        this.form.enable();
        this.isLoading = false;
      }),
      takeUntil(this.destroy$)
    ).subscribe();
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


  isStatusInvalid(status: PositionStatus) {
    return [
      PositionStatus.WINNER_SELECTED,
      PositionStatus.TCP_WINNER_SELECTED,
      PositionStatus.RESULTS_AGREEMENT
    ].includes(status);
  }

  filterContragents(q: string, contragent: ContragentList): boolean {
    return contragent.inn.indexOf(q.toLowerCase()) >= 0 || contragent.shortName.toLowerCase().indexOf(q.toLowerCase()) >= 0;
  }

  addDocuments($event) {
    this.form.get('documents.procedureUploadDocuments').setValue([...this.form.get('documents.procedureUploadDocuments').value, ...$event]);
  }

  trackById = (item: RequestPosition | ContragentList) => item.id;
  defaultProcedureValue = (field: string, defaultValue: any = "") => this.procedure?.[field] ?? defaultValue;
  disabledPositions = ({ hasProcedure, status }: RequestPosition): boolean => hasProcedure || this.isStatusInvalid(status);

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
