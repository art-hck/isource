import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidationErrors, Validators } from "@angular/forms";
import { Request } from "../../../../common/models/request";
import { fromEvent, merge, Observable } from "rxjs";
import { TechnicalProposalsService } from "../../../services/technical-proposals.service";
import { auditTime, flatMap, map } from "rxjs/operators";
import { PositionWithManufacturerName } from "../../../models/position-with-manufacturer-name";

@Component({
  selector: 'app-request-technical-proposals-create',
  templateUrl: './request-technical-proposals-create.component.html',
  styleUrls: ['./request-technical-proposals-create.component.scss']
})
export class RequestTechnicalProposalsCreateComponent implements OnInit, AfterViewInit {

  @Input() request: Request;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() create = new EventEmitter();
  @ViewChild('contragentName', { static: false }) contragentName: ElementRef;
  isLoading: boolean;
  form: FormGroup;
  positionsWithManufacturer$: Observable<PositionWithManufacturerName[]>;

  get formDocuments() {
    return this.form.get('documents') as FormArray;
  }

  get isManufacturerPristine(): boolean {
    return this.form.get("positions").value.filter(pos => pos.manufacturer_name).length === 0;
  }

  constructor(private fb: FormBuilder, private technicalProposalsService: TechnicalProposalsService) {}

  ngOnInit() {
    this.form = this.fb.group({
      contragentName: [null, Validators.required],
      contragent: [null, Validators.required],
      documents: this.fb.array([]),
      positions: [[], Validators.required]
    });

    this.form.valueChanges.subscribe(() => {
      this.form.get('positions').setValidators(
        this.formDocuments.value.length > 0 && this.isManufacturerPristine ?
          [Validators.required] :
          [Validators.required, this.positionsValidator]
      );

      this.form.get('positions').updateValueAndValidity({ emitEvent: false });
    });

    this.positionsWithManufacturer$ = this.technicalProposalsService.getTechnicalProposalsPositionsList(this.request.id)
      .pipe(map(positions => positions.map(position => ({position, manufacturer_name: null}))));

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

  filesDropped(files: FileList): void {
    Array.from(files).forEach(
      file => this.formDocuments.push(this.fb.control(file))
    );
  }

  filesSelected(e) {
    this.filesDropped(e.target.files);
    e.target.value = '';
  }

  submit(isDraft = false) {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    this.form.disable();

    const body = {
      contragentId: this.form.get("contragent").value[0].id,
      positions: this.form.get("positions").value.map(positionsWithMan => positionsWithMan.position.id),
    };

    const docs = this.form.get("documents").value;

    // Отправляем ТП
    let tp$: Observable<any> = this.technicalProposalsService.addTechnicalProposal(this.request.id, body);

    // Если есть доки - загружаем
    if (docs.length) {
      tp$ = tp$.pipe(
        flatMap(tp => {
          const formData = new FormData();
          docs.forEach((doc, i) => formData.append(`files[documents][${i}]`, doc, doc.name));

          return this.technicalProposalsService.uploadSelectedDocuments(this.request.id, tp.id, formData)
            .pipe(map(() => tp));
        })
      );
    }

    // Проставляем заводские наименования.
    // @TODO Отправлять весь массив а не по одному элементу, как только будет бэк!
    this.form.get("positions").value
      .filter(positionWithMan => positionWithMan.manufacturer_name)
      .map(positionWithMan => ({
        position: {id: positionWithMan.position.id},
        manufacturingName: positionWithMan.manufacturer_name
      }))
      .forEach(data => {
        tp$ = tp$.pipe(flatMap(
          tp => this.technicalProposalsService.updateTpPositionManufacturingName(this.request.id, tp.id, data)
            .pipe(map(() => tp))
          )
        );
      });

    // Если не черновик, отправляем на согласование
    if (!isDraft) {
      tp$ = tp$.pipe(flatMap(
        tp => this.technicalProposalsService.sendToAgreement(this.request.id, tp)
          .pipe(map(() => tp)) // @TODO Remove pipe when backend fix
      ));
    }

    tp$.subscribe(tp => {
      this.visibleChange.emit(false);
      this.create.emit(tp);
    });
  }

  positionsValidator(control: AbstractControl): ValidationErrors | null {
    return control.value.length === control.value
      .filter(pos => pos.manufacturer_name).length ? null : { manufacturer_name_error: true };
  }

  positionsWithManufacturerFilter(q: string, posWithMan: PositionWithManufacturerName) {
    return posWithMan.position.name.toLowerCase().indexOf(q.toLowerCase()) >= 0;
  }

  trackByPositionId = (item: PositionWithManufacturerName) => item.position.id;
}
