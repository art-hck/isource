import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidationErrors, Validators } from "@angular/forms";
import { Request } from "../../../../common/models/request";
import { fromEvent, merge, Observable } from "rxjs";
import { TechnicalProposalsService } from "../../../services/technical-proposals.service";
import { auditTime, flatMap, map, mapTo } from "rxjs/operators";
import { PositionWithManufacturerName } from "../../../models/position-with-manufacturer-name";
import { TechnicalProposal } from "../../../../common/models/technical-proposal";
import { TechnicalProposalCreateRequest } from "../../../models/technical-proposal-create-request";
import { ContragentService } from "../../../../../contragent/services/contragent.service";
import { ContragentList } from "../../../../../contragent/models/contragent-list";
import { TechnicalProposalPositionStatus } from "../../../../common/enum/technical-proposal-position-status";
import { TechnicalProposalPosition } from "../../../../common/models/technical-proposal-position";
import { RequestPosition } from "../../../../common/models/request-position";

@Component({
  selector: 'app-request-technical-proposals-create',
  templateUrl: './request-technical-proposals-create.component.html',
  styleUrls: ['./request-technical-proposals-create.component.scss']
})
export class RequestTechnicalProposalsCreateComponent implements OnInit, AfterViewInit {

  @Input() request: Request;
  @Input() technicalProposal: TechnicalProposal;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() create = new EventEmitter<TechnicalProposal>();
  @Output() update = new EventEmitter<TechnicalProposal>();
  @ViewChild('contragentName', { static: false }) contragentName: ElementRef;
  isLoading: boolean;
  form: FormGroup;
  positionsWithManufacturer$: Observable<PositionWithManufacturerName[]>;
  contragents$: Observable<ContragentList[]>;

  get formDocuments() {
    return this.form.get('documents') as FormArray;
  }

  get isManufacturerPristine(): boolean {
    return this.form.get("positions").value.filter(pos => pos.manufacturingName).length === 0;
  }

  get isEditing(): boolean {
    return !!this.technicalProposal;
  }

  constructor(
    private fb: FormBuilder,
    private technicalProposalsService: TechnicalProposalsService,
    private contragentService: ContragentService
  ) {
  }

  ngOnInit() {
    this.form = this.fb.group({
      id: [this.defaultTPValue('id')],
      contragentName: [this.defaultTPValue('name'), Validators.required],
      contragent: [this.supplierContragent, Validators.required],
      documents: this.fb.array([]),
      positions: [this.defaultTPValue('positions', []), Validators.required]
    });

    if (this.isEditing) {
      this.form.get('contragentName').disable();
    }

    this.form.valueChanges.subscribe(() => {
      const docsCount = this.formDocuments.value.length + this.defaultTPValue('documents').length;
      this.form.get('positions').setValidators(
        docsCount > 0 && this.isManufacturerPristine ?
          [Validators.required] :
          [Validators.required, this.positionsValidator]
      );

      this.form.get('positions').updateValueAndValidity({emitEvent: false});
    });

    this.positionsWithManufacturer$ = this.technicalProposalsService.getTechnicalProposalsPositionsList(this.request.id)
      .pipe(map(positions => positions.map(position => ({position, manufacturingName: null}))));

    this.contragents$ = this.contragentService.getContragentList();

    // Workaround sync with multiple elements per one formControl
    this.form.get('positions').valueChanges
      .subscribe(v => this.form.get('positions').setValue(v, {onlySelf: true, emitEvent: false}));
  }

  ngAfterViewInit() {
    // @TODO: uxg-autocomplete!
    merge(
      this.form.get("contragent").valueChanges,
      fromEvent(this.contragentName.nativeElement, "blur"),
    )
      .pipe(auditTime(100))
      .subscribe(() => {
        const value = this.form.get("contragent").value;
        this.form.get("contragentName").setValue(value ? value[0].shortName : null, {emitEvent: false});
        this.form.get("contragentName").updateValueAndValidity();
      });
  }

  filesSelected(files: File[]): void {
    files.forEach(
      file => this.formDocuments.push(this.fb.control(file))
    );
  }

  /**
   * @TODO Remove ALL pipes mapTo(...) when backend fix
   */
  submit(publish = true): void {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    this.form.disable();

    let body: TechnicalProposalCreateRequest = {
      contragentId: this.form.get("contragent").value[0].id,
      positions: this.form.get("positions").value.map(positionsWithMan => positionsWithMan.position.id),
    };

    const docs = this.form.get("documents").value;

    let tp$: Observable<TechnicalProposal>;

    // Создаём / изменяем ТП
    if (!this.isEditing) {
      tp$ = this.technicalProposalsService.addTechnicalProposal(this.request.id, body);
    } else {
      body = {id: this.form.get("id").value, ...body};
      tp$ = this.technicalProposalsService.updateTechnicalProposal(this.request.id, body);
    }

    // Если есть доки - загружаем
    if (docs.length) {
      tp$ = tp$.pipe(
        flatMap(tp => {
          const formData = new FormData();
          docs.forEach((doc, i) => formData.append(`files[documents][${i}]`, doc, doc.name));

          return this.technicalProposalsService.uploadSelectedDocuments(this.request.id, tp.id, formData)
            .pipe(mapTo(tp));
        })
      );
    }

    // Проставляем заводские наименования.
    this.form.get("positions").value
      .filter(({manufacturingName}) => manufacturingName)
      .filter(({position, manufacturingName}) => {
        const tpPosition = this.findTpPosition(position);
        return !tpPosition || tpPosition.manufacturingName !== manufacturingName;
      })
      .map(({position, manufacturingName}) => ({
        position: {id: position.id},
        manufacturingName
      }))
      .forEach(data => {
        tp$ = tp$.pipe(flatMap(
          tp => this.technicalProposalsService.updateTpPositionManufacturingName(this.request.id, tp.id, data)
            .pipe(mapTo(tp))
          )
        );
      });

    // Отправляем на согласование
    if (publish) {
      tp$ = tp$.pipe(flatMap(
        tp => this.technicalProposalsService.sendToAgreement(this.request.id, tp)
          .pipe(mapTo(tp))
      ));
    }

    tp$.subscribe(tp => {
      this.visibleChange.emit(false);
      this.isEditing ? this.update.emit(tp) : this.create.emit(tp);
    });
  }

  positionsValidator(control: AbstractControl): ValidationErrors | null {
    return control.value.length === control.value
      .filter(pos => pos.manufacturingName).length ? null : {manufacturer_name_error: true};
  }

  positionsWithManufacturerFilter(q: string, posWithMan: PositionWithManufacturerName) {
    return posWithMan.position.name.toLowerCase().indexOf(q.toLowerCase()) >= 0;
  }

  private findTpPosition(position: RequestPosition): TechnicalProposalPosition {
    return this.technicalProposal && this.technicalProposal.positions.find(tpp => tpp.positionId === position.id);
  }

  private get supplierContragent() {
    const supplierContragent = this.defaultTPValue('supplierContragent', null);
    return supplierContragent ? [supplierContragent] : null;
  }

  trackByPositionId = ({position}: PositionWithManufacturerName) => position.id;
  defaultTPValue = (field: keyof TechnicalProposal, defaultValue: any = "") => this.technicalProposal && this.technicalProposal[field] || defaultValue;

  positionSelectDisabled = ({position}: PositionWithManufacturerName) => {
    const tpPosition = this.findTpPosition(position);
    return tpPosition && tpPosition.status !== TechnicalProposalPositionStatus.NEW;
  }

  positionManufacturerNameDisabled = ({position}: PositionWithManufacturerName) => {
    const tpPosition = this.findTpPosition(position);
    return tpPosition && tpPosition.status === TechnicalProposalPositionStatus.ACCEPTED;
  }

  onDownloadTemplate() {
    const contragentId = this.form.get("contragent").value[0].id;
    this.technicalProposalsService.downloadTemplate(this.request.id, contragentId);
  }
}
