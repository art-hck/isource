import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Request } from "../../../common/models/request";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Observable } from "rxjs";
import { ContragentList } from "../../../../contragent/models/contragent-list";
import { ContragentService } from "../../../../contragent/services/contragent.service";
import { shareReplay } from "rxjs/operators";
import { TechnicalCommercialProposal } from "../../../common/models/technical-commercial-proposal";
import { Select, Store } from "@ngxs/store";
import { TechnicalCommercialProposals } from "../../actions/technical-commercial-proposal.actions";
import { proposalManufacturerValidator } from "../proposal-form-manufacturer/proposal-form-manufacturer.validator";
import { TechnicalCommercialProposalPosition } from "../../../common/models/technical-commercial-proposal-position";
import { ProposalsStateStatus, TechnicalCommercialProposalState } from "../../states/technical-commercial-proposal.state";
import Update = TechnicalCommercialProposals.Update;
import Create = TechnicalCommercialProposals.Create;
import Publish = TechnicalCommercialProposals.Publish;

@Component({
  selector: 'app-technical-commercial-proposal-form',
  templateUrl: './technical-commercial-proposal-form.component.html',
  styleUrls: ['./technical-commercial-proposal-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TechnicalCommercialProposalFormComponent implements OnInit {
  @Input() request: Request;
  @Input() technicalCommercialProposal: TechnicalCommercialProposal;
  @Input() closable = true;
  @Output() close = new EventEmitter();
  @Select(TechnicalCommercialProposalState.status)
  status$: Observable<ProposalsStateStatus>;
  @Select(TechnicalCommercialProposalState.availablePositions)
  availablePositions$: Observable<TechnicalCommercialProposalPosition[]>;
  form: FormGroup;
  contragents$: Observable<ContragentList[]>;

  get isManufacturerPristine(): boolean {
    return this.form.get("positions").value.filter(pos => pos.manufacturingName).length === 0;
  }

  get isEditing(): boolean {
    return !!this.technicalCommercialProposal;
  }

  constructor(
    private fb: FormBuilder,
    private contragentService: ContragentService,
    private store: Store
  ) {
  }

  get formFiles() {
    return this.form.get("files") as FormArray;
  }


  ngOnInit() {
    this.form = this.fb.group({
      id: [this.defaultValue('id', null)],
      supplier: [this.defaultValue('supplier', null), Validators.required],
      documents: [this.defaultValue('documents', [])],
      positions: [this.defaultValue('positions', []), Validators.required],
      files: this.fb.array([]),
    });

    this.form.valueChanges.subscribe(() => {
      const docsCount = this.formFiles.value.length + this.form.get('documents').value.length;
      this.form.get('positions').setValidators(
        docsCount > 0 && this.isManufacturerPristine ?
          [Validators.required] :
          [Validators.required, proposalManufacturerValidator]
      );

      this.form.get('positions').updateValueAndValidity({emitEvent: false});
    });

    // Workaround sync with multiple elements per one formControl
    this.form.get('positions').valueChanges
      .subscribe(v => this.form.get('positions').setValue(v, {onlySelf: true, emitEvent: false}));

    this.contragents$ = this.contragentService.getContragentList().pipe(shareReplay(1));
    this.store.dispatch(new TechnicalCommercialProposals.FetchAvailablePositions(this.request.id));
  }

  filesSelected(files: File[]): void {
    files.forEach(
      file => this.formFiles.push(this.fb.control(file))
    );
  }

  submit(publish = true): void {
    if (this.form.invalid) {
      return;
    }

    this.form.disable();

    if (this.form.pristine) {
      if (publish) {
        this.store.dispatch(new Publish(this.request.id, this.technicalCommercialProposal))
          .subscribe(() => this.close.emit());
      } else {
        this.close.emit();
      }
      return;
    }

    const value = { ...this.form.value };
    Object.keys(value).forEach(key => value[key] == null && delete value[key]);

    this.store.dispatch(value.id ?
        new Update(this.request.id, value, publish) :
        new Create(this.request.id, value, publish)
    ).subscribe(() => this.close.emit());
  }

  searchPosition(q: string, {position}: TechnicalCommercialProposalPosition) {
    return position.name.toLowerCase().indexOf(q.toLowerCase()) >= 0;
  }

  searchContragent(query: string, contragents: ContragentList[]) {
    return contragents.filter(
      c => c.shortName.toLowerCase().indexOf(query.toLowerCase()) >= 0 || c.inn.indexOf(query) >= 0);
  }

  defaultValue = (field: keyof TechnicalCommercialProposal, defaultValue: any = "") => this.technicalCommercialProposal && this.technicalCommercialProposal[field] || defaultValue;
  getContragentName = (contragent: ContragentList) => contragent.shortName || contragent.fullName;
  trackByPositionId = ({position}: TechnicalCommercialProposalPosition) => position.id;

}
