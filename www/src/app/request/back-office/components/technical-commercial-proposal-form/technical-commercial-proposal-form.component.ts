import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Request } from "../../../common/models/request";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Observable } from "rxjs";
import { ContragentList } from "../../../../contragent/models/contragent-list";
import { ContragentService } from "../../../../contragent/services/contragent.service";
import { shareReplay } from "rxjs/operators";
import { TechnicalCommercialProposal } from "../../../common/models/technical-commercial-proposal";
import { Store } from "@ngxs/store";
import { TechnicalCommercialProposals } from "../../actions/technical-commercial-proposal.actions";
import { proposalManufacturerValidator } from "../technical-proposal-form/technical-proposal-form-manufacturer/technical-proposal-form-manufacturer.validator";

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
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  isLoading: boolean;
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

    // Если документов нет, нужно приложить файлы
    if (!this.form.get('documents').value.length) {
      this.formFiles.setValidators(Validators.required);
    }

    this.form.valueChanges.subscribe(() => {
      const docsCount = this.formFiles.value.length + this.defaultValue('documents').length;
      this.form.get('positions').setValidators(
        docsCount > 0 && this.isManufacturerPristine ?
          [Validators.required] :
          [Validators.required, proposalManufacturerValidator]
      );

      this.form.get('positions').updateValueAndValidity({emitEvent: false});
    });

    this.contragents$ = this.contragentService.getContragentList().pipe(shareReplay(1));
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
    this.isLoading = true;
    this.form.disable();
    Object.keys(this.form.value).forEach(key => this.form.value[key] == null && delete this.form.value[key]);

    this.store.dispatch(
      this.form.value.id ?
        new TechnicalCommercialProposals.Update(this.request.id, this.form.value) :
        new TechnicalCommercialProposals.Create(this.request.id, this.form.value)
    ).subscribe(() => this.visibleChange.emit(false));
  }

  getContragentName = (contragent: ContragentList) => contragent.shortName || contragent.fullName;
  searchContragent = (query: string, contragents: ContragentList[]) => {
    return contragents.filter(
      c => c.shortName.toLowerCase().indexOf(query.toLowerCase()) >= 0 || c.inn.indexOf(query) >= 0);
  }

  defaultValue = (field: keyof TechnicalCommercialProposal, defaultValue: any = "") => this.technicalCommercialProposal && this.technicalCommercialProposal[field] || defaultValue;
}
