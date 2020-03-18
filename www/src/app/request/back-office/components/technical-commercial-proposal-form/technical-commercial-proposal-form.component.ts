import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Request } from "../../../common/models/request";
import { TechnicalProposal } from "../../../common/models/technical-proposal";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Observable } from "rxjs";
import { ContragentList } from "../../../../contragent/models/contragent-list";
import { ContragentService } from "../../../../contragent/services/contragent.service";
import { shareReplay } from "rxjs/operators";
import { TechnicalCommercialProposal } from "../../../common/models/technical-commercial-proposal";
import { Store } from "@ngxs/store";
import { TechnicalCommercialProposals } from "../../actions/technical-commercial-proposal.actions";

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

  get isEditing(): boolean {
    return !!this.technicalCommercialProposal;
  }

  constructor(
    private fb: FormBuilder,
    private contragentService: ContragentService,
    private store: Store
  ) {
  }

  ngOnInit() {
    this.form = this.fb.group({
      id: [this.defaultValue('id', null)],
      contragent: [this.defaultValue('supplierContragent', null), Validators.required],
    });

    this.contragents$ = this.contragentService.getContragentList().pipe(shareReplay(1));
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

  defaultValue = (field: keyof TechnicalProposal, defaultValue: any = "") => this.technicalCommercialProposal && this.technicalCommercialProposal[field] || defaultValue;
}
