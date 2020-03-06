import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidationErrors, Validators } from "@angular/forms";
import { Request } from "../../../../common/models/request";
import { Observable, Subscription } from "rxjs";
import { TechnicalProposalsService } from "../../../services/technical-proposals.service";
import { flatMap, map, mapTo, shareReplay } from "rxjs/operators";
import { PositionWithManufacturerName } from "../../../models/position-with-manufacturer-name";
import { TechnicalProposal } from "../../../../common/models/technical-proposal";
import { TechnicalProposalCreateRequest } from "../../../models/technical-proposal-create-request";
import { ContragentService } from "../../../../../contragent/services/contragent.service";
import { ContragentList } from "../../../../../contragent/models/contragent-list";
import { TechnicalProposalPositionStatus } from "../../../../common/enum/technical-proposal-position-status";
import { TechnicalProposalPosition } from "../../../../common/models/technical-proposal-position";
import { RequestPosition } from "../../../../common/models/request-position";
import Swal from "sweetalert2";
import { TechnicalProposalsStatuses } from "../../../../common/enum/technical-proposals-statuses";

@Component({
  selector: 'app-request-technical-proposals-create',
  templateUrl: './request-technical-proposals-create.component.html',
  styleUrls: ['./request-technical-proposals-create.component.scss']
})
export class RequestTechnicalProposalsCreateComponent implements OnInit, OnDestroy {

  @Input() request: Request;
  @Input() technicalProposal: TechnicalProposal;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() create = new EventEmitter<TechnicalProposal>();
  @Output() update = new EventEmitter<TechnicalProposal>();
  isLoading: boolean;
  form: FormGroup;
  positionsWithManufacturer$: Observable<PositionWithManufacturerName[]>;
  contragents$: Observable<ContragentList[]>;
  files: File[] = [];
  subscription = new Subscription();

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
      contragent: [this.defaultTPValue('supplierContragent', null), Validators.required],
      documents: this.fb.array([]),
      positions: [this.defaultTPValue('positions', []), Validators.required]
    });

    if (this.isEditing && this.technicalProposal.status !== TechnicalProposalsStatuses.NEW) {
      this.form.get('contragent').disable();
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

    // Workaround sync with multiple elements per one formControl
    this.form.get('positions').valueChanges
      .subscribe(v => this.form.get('positions').setValue(v, {onlySelf: true, emitEvent: false}));

    this.contragents$ = this.contragentService.getContragentList().pipe(shareReplay(1));

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
      contragentId: this.form.get("contragent").value.id,
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
    return supplierContragent ? supplierContragent : null;
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
    const contragentId = this.form.get("contragent").value.id;
    this.technicalProposalsService.downloadTemplate(this.request.id, contragentId);
  }

  onChangeFilesList(files: File[]): void {
    this.files = files;
  }

  onSendTemplatePositions(): void {
    this.subscription.add(this.technicalProposalsService.addPositionsFromExcel(this.request.id, this.files).subscribe((data: any) => {
      this.create.emit(data.requestTechnicalProposal);
      Swal.fire({
        width: 400,
        html: '<p class="text-alert">' + 'Шаблон импортирован</br></br>' + '</p>' +
          '<button id="submit" class="btn btn-primary">' +
          'ОК' + '</button>',
        showConfirmButton: false,
        onBeforeOpen: () => {
          const content = Swal.getContent();
          const $ = content.querySelector.bind(content);
          const submit = $('#submit');
          submit.addEventListener('click', () => {
            Swal.close();
          });
        }
      });
    }, (error: any) => {
      let msg = 'Ошибка в шаблоне';
      if (error && error.error && error.error.detail) {
        msg = `${msg}: ${error.error.detail}`;
      }
      alert(msg);
    }));
  }

  getContragentName = (contragent: ContragentList) => contragent.shortName || contragent.fullName;
  searchContragent = (query: string, contragents: ContragentList[]) => {
    return contragents.filter(
      c => c.shortName.toLowerCase().indexOf(query.toLowerCase()) >= 0 || c.inn.indexOf(query) >= 0);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
